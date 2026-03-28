require('dotenv').config(); // 🔴 SDE-3 Fix: MUST BE LINE 1
const db = require('./config/db');

async function setupDatabase() {
  try {
    console.log('🔍 Checking DATABASE_URL:', process.env.DATABASE_URL ? '✅ Found it!' : '❌ STILL EMPTY');
    console.log('⏳ Building tables in Neon Cloud...');
    
    // Create the Quizzes table
    await db.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id UUID PRIMARY KEY,
        prompt TEXT NOT NULL,
        questions JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create the Attempts table (so you can save user scores)
    await db.query(`
      CREATE TABLE IF NOT EXISTS attempts (
        id UUID PRIMARY KEY,
        quiz_id UUID REFERENCES quizzes(id),
        student_id VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tables created successfully in the cloud!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
    process.exit(1);
  }
}

setupDatabase();