const db = require('../config/db');

const normalize = (str) => String(str).trim().toLowerCase();

async function submitAttempt(quiz, studentId, userAnswers) {
  let score = 0;
  userAnswers.forEach((userAns) => {
    const question = quiz.questions[userAns.questionIndex];
    if (question && normalize(question.correctAnswer) === normalize(userAns.answer)) {
      score++;
    }
  });

  const query = `
    INSERT INTO attempts (quiz_id, student_id, score, total) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *`;
  
  const values = [quiz.id, studentId, score, quiz.questions.length];
  const result = await db.query(query, values);
  return result.rows[0];
}

module.exports = { submitAttempt };