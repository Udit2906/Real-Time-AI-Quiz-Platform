const db = require('../config/db');
const Groq = require('groq-sdk');

// 1. Initialize OpenAI (Ensure OPENAI_API_KEY is in your .env)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

let uuidv4;

// 2. Dynamic Import for UUID (Node 22 fix)
(async () => {
  try {
    const uuidModule = await import('uuid');
    uuidv4 = uuidModule.v4;
  } catch (err) {
    console.error("❌ Failed to load UUID:", err);
  }
})();

/**
 * FETCH: Gets a quiz from the Postgres Database
 */
async function getQuizById(quizId) {
  try {
    const query = 'SELECT * FROM quizzes WHERE id = $1';
    const result = await db.query(query, [quizId]);
    
    // Returns the first row found or undefined if not found
    return result.rows[0]; 
  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
    throw err;
  }
}

/**
 * CREATE: Generates a quiz via AI and saves it to Postgres
 */
async function createQuiz(prompt) {
  // Ensure UUID is ready
  if (!uuidv4) {
    const { v4 } = await import('uuid');
    uuidv4 = v4;
  }

  const quizId = uuidv4();

  try {
    // 🤖 AI GENERATION: Requesting structured JSON from OpenAI
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a quiz generator. Return ONLY a JSON object with a 'questions' key. No conversational text. Each question must have: 'question', 'options' (array of 4), and 'correctAnswer'."
        },
        {
          role: "user",
          content: `Topic: ${prompt}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    // Parse the AI response
    const aiContent = JSON.parse(completion.choices[0].message.content);
    const questions = aiContent.questions;

    // 💾 SQL INSERT: Save the AI results permanently
    const query = 'INSERT INTO quizzes (id, prompt, questions) VALUES ($1, $2, $3) RETURNING *';
    const values = [quizId, prompt, JSON.stringify(questions)];
    
    const result = await db.query(query, values);
    
    console.log(`✅ Groq Quiz Created: ${quizId}`);
    return result.rows[0];
  } catch (err) {
    console.error("❌ Groq/DB Create Error:", err.message);
    throw new Error("Failed to generate quiz: " + err.message);
  }
}

module.exports = { createQuiz, getQuizById };