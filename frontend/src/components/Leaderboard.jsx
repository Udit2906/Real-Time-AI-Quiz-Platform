import React, { useState, useEffect } from 'react';

function Leaderboard({ quizId, socket }) {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (!socket || !quizId) return;

    // 1. Join the specific room for this quiz
    socket.emit("join_quiz", quizId);

    // 2. Listen for the "New Submission" event from the backend
    const handleNewSubmission = (data) => {
      console.log("🔥 NEW SCORE RECEIVED IN BROWSER:", data);
      setSubmissions((prev) => [data, ...prev]); 
    };

    socket.on("new_submission", handleNewSubmission);

    // Cleanup to prevent double-listening
    return () => {
      socket.off("new_submission", handleNewSubmission);
    };
  }, [quizId, socket]);

  return (
    <div style={{ marginTop: '30px', padding: '20px', background: '#f0f4f8', borderRadius: '10px' }}>
      <h3 style={{ color: '#1a1a1a', margin: '0 0 15px 0' }}>📈 Live Leaderboard</h3>
      
      {submissions.length === 0 && <p style={{ color: '#888' }}>Waiting for submissions...</p>}
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {submissions.map((s, i) => (
          <li key={i} style={{ 
            padding: '12px', 
            background: 'white', 
            marginBottom: '8px', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            borderLeft: '5px solid #646cff',
            color: '#1a1a1a' // Forced dark color
          }}>
            <strong>{s.student_id}</strong>
            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>{s.score} / {s.total}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;