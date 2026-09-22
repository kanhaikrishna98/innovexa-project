const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const COOKIE_NAME = "education_session";
const secret = () => process.env.JWT_SECRET || "development-only-change-me";
const isProduction = () => process.env.NODE_ENV === "production";
const cookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "none" : "lax",
  path: "/",
});

function signSession(userId) { return jwt.sign({ sub: userId }, secret(), { expiresIn: "7d" }); }
function setSession(res, userId) { res.cookie(COOKIE_NAME, signSession(userId), { ...cookieOptions(), maxAge: 7 * 24 * 60 * 60 * 1000 }); }
function clearSession(res) { res.clearCookie(COOKIE_NAME, cookieOptions()); }

function requireAuth(db) {
  return (req, res, next) => {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "Authentication required" });
    try {
      const payload = jwt.verify(token, secret());
      const user = db.prepare("SELECT id, name, email, role, branch, semester, created_at FROM users WHERE id = ?").get(payload.sub);
      if (!user) return res.status(401).json({ error: "Session user no longer exists" });
      req.user = user;
      next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired session" });
    }
  };
}

function hashPassword(password) { return bcrypt.hash(password, 12); }
function verifyPassword(password, hash) { return bcrypt.compare(password, hash); }
function id() { return crypto.randomUUID(); }

module.exports = { COOKIE_NAME, setSession, clearSession, requireAuth, hashPassword, verifyPassword, id };
