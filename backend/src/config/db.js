const { Pool } = require('pg');

// Create a pool of connections
// 🔴 DEBUG LOG: Let's see if the password exists
console.log("🛠️  Checking DB Config...");
console.log("DB User:", process.env.DB_USER);
console.log("DB Password found:", process.env.DB_PASSWORD ? "YES (hidden)" : "NO (undefined)");
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// SDE-3 Tip: Log when the DB connects
pool.on('connect', () => {
  console.log('🐘 Postgres Database Connected');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};