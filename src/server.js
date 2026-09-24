require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { z } = require("zod");
const db = require("./db");
const { buildPlan, riskForSubject } = require("./recommendations");
const { clearSession, setSession, requireAuth, hashPassword, verifyPassword, id } = require("./auth");

const app = express();
const DEFAULT_CLIENT_ORIGINS = ["http://127.0.0.1:4173", "http://localhost:4173", "http://localhost:3000"];
const configuredOrigins = [process.env.CLIENT_URL, ...(process.env.CLIENT_URLS || "").split(",")]
  .map((origin) => origin?.trim())
  .filter(Boolean);
const clientOrigins = new Set([...DEFAULT_CLIENT_ORIGINS, ...configuredOrigins]);
const clientUrl = configuredOrigins[0] || DEFAULT_CLIENT_ORIGINS[0];

app.disable("x-powered-by");
app.set("trust proxy", 1);
const allowedOrigins = new Set([
  "https://innovexa-frontend-live.vercel.app",
  "https://innovexa-frontend-git-main-innovexa-0f43.vercel.app",
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(passport.initialize());

const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  branch: z.string().trim().min(2).max(80).optional(),
  semester: z.string().trim().max(20).optional(),
});
const assessmentSchema = z.object({
  subject_id: z.string().uuid(),
  title: z.string().trim().min(2).max(120).optional(),
  topic: z.string().trim().max(120).optional(),
  score: z.number().nonnegative().max(1000),
  max_score: z.number().positive().max(1000).default(100),
  assessed_at: z.string().min(10).max(40).optional(),
});
const attendanceSchema = z.object({
  subject_id: z.string().uuid(),
  status: z.enum(["present", "absent"]),
  recorded_at: z.string().min(10).max(40).optional(),
});
const assignmentSchema = z.object({
  subject_id: z.string().uuid(),
  title: z.string().trim().min(2).max(160),
  instructions: z.string().trim().max(5000).optional(),
  due_at: z.string().min(10).max(40),
});
const planSchema = z.object({ available_hours: z.number().positive().max(168), week_start: z.string().date().optional() });

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "student",
    branch: user.branch || null,
    semester: user.semester || null,
    created_at: user.created_at,
  };
}

function seedStarterSubjects(userId) {
  const starterSubjects = [
    ["Data Structures", "CSE-DSA"],
    ["Database Systems", "CSE-DBMS"],
    ["Mathematics III", "CSE-MATH3"],
  ];
  const findSubject = db.prepare("SELECT id FROM subjects WHERE code = ? LIMIT 1");
  const createSubject = db.prepare("INSERT INTO subjects (id, name, code) VALUES (?, ?, ?)");
  const enroll = db.prepare("INSERT OR IGNORE INTO enrollments (user_id, subject_id) VALUES (?, ?)");
  for (const [name, code] of starterSubjects) {
    let subject = findSubject.get(code);
    if (!subject) {
      subject = { id: id() };
      createSubject.run(subject.id, name, code);
    }
    enroll.run(userId, subject.id);
  }
}

function analyticsFor(userId) {
  return db.prepare(`
    SELECT s.id AS subject_id, s.name AS subject, s.code, e.target_score,
      COALESCE(tests.average_score, 0) AS average_score,
      COALESCE(tests.assessment_count, 0) AS assessment_count,
      attendance.attendance_pct AS attendance_pct,
      COALESCE(attendance.attendance_count, 0) AS attendance_count
    FROM enrollments e
    JOIN subjects s ON s.id = e.subject_id
    LEFT JOIN (
      SELECT user_id, subject_id,
        ROUND(AVG(score * 100.0 / max_score), 1) AS average_score,
        COUNT(*) AS assessment_count
      FROM assessments
      WHERE user_id = ?
      GROUP BY user_id, subject_id
    ) tests ON tests.user_id = e.user_id AND tests.subject_id = e.subject_id
    LEFT JOIN (
      SELECT user_id, subject_id,
        ROUND(AVG(CASE WHEN status = 'present' THEN 100.0 ELSE 0 END), 1) AS attendance_pct,
        COUNT(*) AS attendance_count
      FROM attendance_records
      WHERE user_id = ?
      GROUP BY user_id, subject_id
    ) attendance ON attendance.user_id = e.user_id AND attendance.subject_id = e.subject_id
    WHERE e.user_id = ?
    ORDER BY s.name
  `).all(userId, userId, userId).map((subject) => ({
    ...subject,
    average_score: Number(subject.average_score),
    assessment_count: Number(subject.assessment_count),
    attendance_pct: subject.attendance_pct === null ? null : Number(subject.attendance_pct),
    attendance_count: Number(subject.attendance_count),
  }));
}

function assignmentsFor(userId) {
  return db.prepare(`
    SELECT a.id, a.subject_id, s.name AS subject, s.code, a.title, a.instructions, a.due_at, a.status, a.created_at
    FROM assignments a
    JOIN subjects s ON s.id = a.subject_id
    WHERE a.user_id = ?
    ORDER BY CASE a.status WHEN 'complete' THEN 1 ELSE 0 END, a.due_at ASC
  `).all(userId);
}

function dashboardFor(user) {
  const subjects = analyticsFor(user.id).map((subject) => ({ ...subject, ...riskForSubject(subject) }));
  const plan = buildPlan(subjects, 10);
  const riskPenalty = { high: 48, medium: 25, low: 6 };
  const pulseScore = subjects.length
    ? Math.max(0, Math.round(100 - subjects.reduce((sum, subject) => sum + riskPenalty[subject.risk_level], 0) / subjects.length))
    : null;
  const prioritySubject = [...subjects].sort((a, b) => {
    const order = { high: 3, medium: 2, low: 1 };
    return order[b.risk_level] - order[a.risk_level] || a.average_score - b.average_score;
  })[0] || null;

  return {
    user: publicUser(user),
    academic_pulse: {
      score: pulseScore,
      label: prioritySubject?.risk_level === "high" ? "One subject needs care." : prioritySubject?.risk_level === "medium" ? "A small check-in will help." : "You are building a steady baseline.",
      focus_subject: prioritySubject ? prioritySubject.subject : null,
      explanation: "This signal uses attendance and published test results only. Assignments and connected profiles never change it.",
    },
    subjects,
    assignments: assignmentsFor(user.id),
    plan,
  };
}

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/auth/signup", async (req, res, next) => {
  try {
    const input = signupSchema.parse(req.body);
    const user = {
      id: id(), name: input.name, email: input.email.toLowerCase(), password_hash: await hashPassword(input.password),
      role: "student", branch: input.branch || null, semester: input.semester || null,
    };
    db.prepare("INSERT INTO users (id, name, email, password_hash, role, branch, semester) VALUES (@id, @name, @email, @password_hash, @role, @branch, @semester)").run(user);
    seedStarterSubjects(user.id);
    setSession(res, user.id);
    res.status(201).json({ user: publicUser(user), seeded_subjects: true });
  } catch (error) {
    if (error.name === "ZodError") return res.status(400).json({ error: "Invalid signup data", details: error.issues });
    if (String(error.message).includes("UNIQUE")) return res.status(409).json({ error: "An account with that email already exists" });
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const input = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(input.email.toLowerCase());
    if (!user || !user.password_hash || !(await verifyPassword(input.password, user.password_hash))) return res.status(401).json({ error: "Invalid email or password" });
    setSession(res, user.id);
    res.json({ user: publicUser(user) });
  } catch (error) {
    if (error.name === "ZodError") return res.status(400).json({ error: "Invalid login data" });
    next(error);
  }
});

app.post("/api/auth/logout", (_req, res) => { clearSession(res); res.status(204).end(); });
app.get("/api/auth/me", requireAuth(db), (req, res) => res.json({ user: req.user }));
app.patch("/api/auth/me", requireAuth(db), (req, res, next) => {
  try {
    const input = z.object({
      name: z.string().trim().min(2).max(80).optional(),
      branch: z.string().trim().max(80).nullable().optional(),
      semester: z.string().trim().max(20).nullable().optional(),
    });
    const updates = input.parse(req.body);
    const fields = Object.keys(updates);
    if (!fields.length) return res.status(400).json({ error: "No profile changes supplied" });
    const values = fields.map((field) => updates[field] === "" ? null : updates[field]);
    db.prepare(`UPDATE users SET ${fields.map((field) => `${field} = ?`).join(", ")} WHERE id = ?`).run(...values, req.user.id);
    res.json({ user: db.prepare("SELECT id, name, email, role, branch, semester, created_at FROM users WHERE id = ?").get(req.user.id) });
  } catch (error) {
    if (error.name === "ZodError") return res.status(400).json({ error: "Invalid profile data", details: error.issues });
    next(error);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://127.0.0.1:4000/api/auth/google/callback",
  }, (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();
      if (!email) return done(new Error("Google account did not provide an email"));
      let user = db.prepare("SELECT * FROM users WHERE google_id = ? OR email = ?").get(profile.id, email);
      if (!user) {
        const created = { id: id(), name: profile.displayName || email, email, google_id: profile.id };
        db.prepare("INSERT INTO users (id, name, email, google_id) VALUES (@id, @name, @email, @google_id)").run(created);
        seedStarterSubjects(created.id);
        user = created;
      } else if (!user.google_id) {
        db.prepare("UPDATE users SET google_id = ? WHERE id = ?").run(profile.id, user.id);
      }
      done(null, user);
    } catch (error) { done(error); }
  }));
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
  app.get("/api/auth/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${clientUrl}/?error=google` }), (req, res) => {
    setSession(res, req.user.id);
    res.redirect(clientUrl);
  });
}

app.get("/api/subjects", requireAuth(db), (_req, res) => res.json({ subjects: db.prepare("SELECT * FROM subjects ORDER BY name").all() }));
app.post("/api/subjects/:subjectId/enroll", requireAuth(db), (req, res) => {
  const subject = db.prepare("SELECT id, name, code FROM subjects WHERE id = ?").get(req.params.subjectId);
  if (!subject) return res.status(404).json({ error: "Subject not found" });
  db.prepare("INSERT OR IGNORE INTO enrollments (user_id, subject_id) VALUES (?, ?)").run(req.user.id, subject.id);
  res.status(201).json({ subject });
});
app.post("/api/subjects", requireAuth(db), (req, res, next) => {
  try {
    const input = z.object({ name: z.string().trim().min(2).max(100), code: z.string().trim().max(20).optional(), target_score: z.number().min(0).max(100).optional() }).parse(req.body);
    const subject = { id: id(), name: input.name, code: input.code || null };
    db.prepare("INSERT INTO subjects (id, name, code) VALUES (@id, @name, @code)").run(subject);
    db.prepare("INSERT INTO enrollments (user_id, subject_id, target_score) VALUES (?, ?, ?)").run(req.user.id, subject.id, input.target_score || 80);
    res.status(201).json({ subject: { ...subject, target_score: input.target_score || 80 } });
  } catch (error) {
    if (error.name === "ZodError") return res.status(400).json({ error: "Invalid subject data", details: error.issues });
    next(error);
  }
});

app.post("/api/assessments", requireAuth(db), (req, res, next) => {
  try {
    const input = assessmentSchema.parse(req.body);
    if (input.score > input.max_score) return res.status(400).json({ error: "Score cannot exceed max_score" });
    if (!db.prepare("SELECT 1 FROM enrollments WHERE user_id = ? AND subject_id = ?").get(req.user.id, input.subject_id)) return res.status(403).json({ error: "Enroll in the subject first" });
    const assessment = { id: id(), user_id: req.user.id, ...input, title: input.title || null, topic: input.topic || null, assessed_at: input.assessed_at || new Date().toISOString() };
    db.prepare("INSERT INTO assessments (id, user_id, subject_id, title, topic, score, max_score, assessed_at) VALUES (@id, @user_id, @subject_id, @title, @topic, @score, @max_score, @assessed_at)").run(assessment);
    res.status(201).json({ assessment });
  } catch (error) {
    if (error.name === "ZodError") return res.status(400).json({ error: "Invalid assessment data", details: error.issues });
    next(error);
  }
});

app.post("/api/attendance", requireAuth(db), (req, res, next) => {
  try {
    const input = attendanceSchema.parse(req.body);
    if (!db.prepare("SELECT 1 FROM enrollments WHERE user_id = ? AND subject_id = ?").get(req.user.id, input.subject_id)) return res.status(403).json({ error: "Enroll in the subject first" });
    const attendance = { id: id(), user_id: req.user.id, ...input, recorded_at: input.recorded_at || new Date().toISOString() };
    db.prepare("INSERT INTO attendance_records (id, user_id, subject_id, status, recorded_at) VALUES (@id, @user_id, @subject_id, @status, @recorded_at)").run(attendance);
    res.status(201).json({ attendance });
  } catch (error) {
    if (error.name === "ZodError") return res.status(400).json({ error: "Invalid attendance data", details: error.issues });
    next(error);
  }
});

app.get("/api/assignments", requireAuth(db), (req, res) => res.json({ assignments: assignmentsFor(req.user.id) }));
app.post("/api/assignments", requireAuth(db), (req, res, next) => {
  try {
    const input = assignmentSchema.parse(req.body);
    if (!db.prepare("SELECT 1 FROM enrollments WHERE user_id = ? AND subject_id = ?").get(req.user.id, input.subject_id)) return res.status(403).json({ error: "Enroll in the subject first" });
    const assignment = { id: id(), user_id: req.user.id, ...input, instructions: input.instructions || null, status: "not_started" };
    db.prepare("INSERT INTO assignments (id, user_id, subject_id, title, instructions, due_at, status) VALUES (@id, @user_id, @subject_id, @title, @instructions, @due_at, @status)").run(assignment);
    res.status(201).json({ assignment });
  } catch (error) {
    if (error.name === "ZodError") return res.status(400).json({ error: "Invalid assignment data", details: error.issues });
    next(error);
  }
});

app.patch("/api/assignments/:assignmentId", requireAuth(db), (req, res, next) => {
  try {
    const input = z.object({ status: z.enum(["not_started", "in_progress", "submitted", "complete"]) }).parse(req.body);
    const updated = db.prepare("UPDATE assignments SET status = ? WHERE id = ? AND user_id = ?").run(input.status, req.params.assignmentId, req.user.id);
    if (!updated.changes) return res.status(404).json({ error: "Assignment not found" });
    res.json({ assignment: db.prepare("SELECT * FROM assignments WHERE id = ?").get(req.params.assignmentId) });
  } catch (error) {
    if (error.name === "ZodError") return res.status(400).json({ error: "Invalid assignment status", details: error.issues });
    next(error);
  }
});

app.get("/api/analytics/subjects", requireAuth(db), (req, res) => {
  const subjects = analyticsFor(req.user.id).map((subject) => ({ ...subject, ...riskForSubject(subject) }));
  res.json({ subjects });
});
app.get("/api/student/dashboard", requireAuth(db), (req, res) => res.json(dashboardFor(req.user)));

app.get("/api/study-plans/current", requireAuth(db), (req, res) => {
  const latest = db.prepare("SELECT week_start, available_hours, plan_json, created_at FROM study_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(req.user.id);
  if (!latest) return res.json({ plan: buildPlan(analyticsFor(req.user.id), 10), generated: false });
  res.json({ week_start: latest.week_start, available_hours: latest.available_hours, plan: JSON.parse(latest.plan_json), generated: true });
});
app.post("/api/study-plans", requireAuth(db), (req, res, next) => {
  try {
    const input = planSchema.parse(req.body);
    const weekStart = input.week_start || new Date().toISOString().slice(0, 10);
    const plan = buildPlan(analyticsFor(req.user.id), input.available_hours);
    const record = { id: id(), user_id: req.user.id, week_start: weekStart, available_hours: input.available_hours, plan_json: JSON.stringify(plan) };
    db.prepare("INSERT INTO study_plans (id, user_id, week_start, available_hours, plan_json) VALUES (@id, @user_id, @week_start, @available_hours, @plan_json) ON CONFLICT(user_id, week_start) DO UPDATE SET available_hours = excluded.available_hours, plan_json = excluded.plan_json, created_at = CURRENT_TIMESTAMP").run(record);
    res.status(201).json({ week_start: weekStart, available_hours: input.available_hours, plan });
  } catch (error) {
    if (error.name === "ZodError") return res.status(400).json({ error: "Invalid study plan data", details: error.issues });
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number.parseInt(process.env.PORT, 10) || 4000;
if (require.main === module) app.listen(port, () => console.log(`Smart education API listening on port ${port}`));
module.exports = app;
