require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("AI Quizzer Backend Running");
});

// Register routes in correct order
const healthRoutes = require("./routes/health.routes");
app.use("/health", healthRoutes);

const quizRoutes = require("./routes/quiz.routes");
app.use("/quiz", quizRoutes);

const attemptRoutes = require("./routes/attempt.routes");
app.use("/attempt", attemptRoutes);

// Export app LAST
module.exports = app;
