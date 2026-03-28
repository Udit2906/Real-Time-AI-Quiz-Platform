const express = require("express");
const router = express.Router();

const { getQuizById } = require("../services/quiz.service");
const { submitAttempt } = require("../services/attempt.service");

/**
 * SUBMIT QUIZ ATTEMPT
 * POST /attempt/:quizId/submit
 */
// 🔴 FIX 1: Added 'async' here
router.post("/:quizId/submit", async (req, res) => {
  const { quizId } = req.params;
  const { studentId, answers } = req.body;

  try {
    // 🔴 FIX 1: Added 'await' here so it waits for Postgres
    const quiz = await getQuizById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    // Calculate the score
    const result = await submitAttempt(quiz, studentId, answers);

    // 🔴 FIX 2 & 3: Ensure 'io' name matches server.js and payload matches React!
    // Note: If you used app.set('socketio', io) in server.js, change "io" to "socketio" below.
    const io = req.app.get("io"); 
    if (io) {
      io.to(quizId).emit("new_submission", {
        student_id: studentId, // React is looking for snake_case!
        score: result.score,
        total: result.total
      });
      console.log(`📢 Broadcasted score for ${studentId}`);
    } else {
      console.error("⚠️ Socket.io instance not found on req.app");
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Submit Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;