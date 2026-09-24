const RISK_SHARES = { high: 0.45, medium: 0.35, low: 0.2 };

function rounded(value) {
  return Math.round(value * 10) / 10;
}

function riskForSubject(subject) {
  const attendance = Number(subject.attendance_pct);
  const hasAttendance = Number.isFinite(attendance);
  const average = Number(subject.average_score);
  const hasTests = Number(subject.assessment_count) > 0 && Number.isFinite(average);

  const criticalAttendance = hasAttendance && attendance < 65;
  const criticalTests = hasTests && average < 40;
  const watchAttendance = hasAttendance && attendance >= 65 && attendance < 75;
  const watchTests = hasTests && average >= 40 && average < 60;

  let risk_level = "low";
  if (criticalAttendance || criticalTests) risk_level = "high";
  else if (watchAttendance || watchTests) risk_level = "medium";

  const reasons = [];
  if (criticalAttendance) reasons.push(`Attendance is ${attendance}%, below the 65% alert threshold.`);
  else if (watchAttendance) reasons.push(`Attendance is ${attendance}%, in the watch range.`);
  if (criticalTests) reasons.push(`Recent test average is ${average}%, below the 40% alert threshold.`);
  else if (watchTests) reasons.push(`Recent test average is ${average}%, so a short revision cycle is recommended.`);
  if (!hasAttendance && !hasTests) reasons.push("No attendance or published test result has been recorded yet.");

  return {
    risk_level,
    explanation: reasons.length ? reasons.join(" ") : "Attendance and published test results are currently on track.",
  };
}

function buildPlan(subjects, availableHours) {
  const hours = Number(availableHours);
  if (!Number.isFinite(hours) || hours <= 0 || hours > 168) throw new Error("availableHours must be between 0 and 168");

  const ranked = subjects.map((subject) => {
    const risk = riskForSubject(subject);
    const average = Number(subject.average_score) || 0;
    const assessmentCount = Number(subject.assessment_count) || 0;
    const target = Number(subject.target_score) || 80;
    const gap = Math.max(0, target - average);
    const confidenceBoost = assessmentCount === 0 ? 0.4 : (100 - average) / 300;
    return { ...subject, ...risk, gap: rounded(gap), priority: 1 + gap / 100 + confidenceBoost };
  });

  const presentBands = Object.keys(RISK_SHARES).filter((band) => ranked.some((subject) => subject.risk_level === band));
  const shareTotal = presentBands.reduce((sum, band) => sum + RISK_SHARES[band], 0) || 1;

  return presentBands.flatMap((band) => {
    const inBand = ranked.filter((subject) => subject.risk_level === band);
    const priorityTotal = inBand.reduce((sum, subject) => sum + subject.priority, 0) || 1;
    const bandHours = hours * (RISK_SHARES[band] / shareTotal);
    return inBand.map((subject) => ({
      subject_id: subject.subject_id,
      subject: subject.subject,
      hours: rounded(bandHours * subject.priority / priorityTotal),
      average_score: subject.average_score,
      attendance_pct: subject.attendance_pct,
      risk_level: subject.risk_level,
      target_score: subject.target_score,
      reason: subject.explanation,
      activities: subject.assessment_count === 0
        ? ["Take a short diagnostic quiz", "Review the first core concept", "Add your next class task"]
        : subject.risk_level === "high"
          ? ["Review foundations", "Practice timed questions", "Take a short self-test"]
          : ["Review recent notes", "Complete a focused practice set", "Record one takeaway"],
    }));
  }).sort((a, b) => RISK_SHARES[b.risk_level] - RISK_SHARES[a.risk_level] || b.hours - a.hours);
}

module.exports = { buildPlan, riskForSubject };
