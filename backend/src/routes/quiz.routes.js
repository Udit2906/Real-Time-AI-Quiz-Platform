const express = require("express");
const router = express.Router();

const {
  createQuiz,
  getQuizById,
} = require("../services/quiz.service");

/**
 * CREATE QUIZ
 * POST /quiz/create
 */
router.post("/create", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      error: "Prompt is required",
    });
  }

  try {
    const quiz = await createQuiz(prompt);

    return res.status(201).json({
      quizId: quiz.id,
      questions: quiz.questions,
    });
  } catch (err) {
    // CRITICAL DEBUG LOGGING
    console.error("QUIZ GENERATION FAILED");
    console.error("Message:", err?.message);
    console.error("Stack:", err?.stack);
    console.error("OpenAI response:", err?.response?.data);

    return res.status(500).json({
      error: "Failed to generate quiz",
      details: err?.message || "Unknown error",
    });
  }
});

/**
 * GET QUIZ BY ID
 * GET /quiz/:id
 */
// Notice the 'async' keyword before (req, res)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 🔴 CRITICAL: You MUST have 'await' here
    const quiz = await getQuizById(id);

    if (!quiz || Object.keys(quiz).length === 0) {
      return res.status(404).json({ error: "Quiz not found in Database" });
    }

    res.json(quiz);
  } catch (err) {
    console.error("Route Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
