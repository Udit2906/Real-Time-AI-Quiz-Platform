import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import html2pdf from 'html2pdf.js';
import CreateQuiz from './components/CreateQuiz';
import Leaderboard from './components/Leaderboard';

const socket = io("http://localhost:4000");

function App() {
  const [quizId, setQuizId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [joined, setJoined] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); 
  
  const reportRef = useRef();

  const handleJoin = async () => {
    if (!quizId || !studentId) return alert("Please enter both an ID and your Name!");
    
    try {
      const res = await axios.get(`http://localhost:4000/quiz/${quizId}`);
      setQuiz(res.data);
      setJoined(true);
      setTimeLeft(60); 
    } catch (err) {
      alert("Quiz not found! Check your ID.");
    }
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(userAnswers).map(([index, answer]) => ({
      questionIndex: parseInt(index),
      answer
    }));

    try {
      const res = await axios.post(`http://localhost:4000/attempt/${quizId}/submit`, {
        studentId,
        answers: formattedAnswers
      });
      setScore(res.data); 
    } catch (err) {
      alert("Submission failed!");
    }
  };

  // ⏱️ The Countdown Hook
  useEffect(() => {
    if (joined && !score && timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timerId); 
    } else if (timeLeft === 0 && !score) {
      handleSubmit();
    }
  }, [joined, score, timeLeft]);

  // 📄 The PDF Generator
  const downloadPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin:       0.5,
      filename:     `${studentId}_Quiz_Report.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  // --- UI Logic: 1. Join Screen ---
  if (!joined) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial', maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ color: '#646cff' }}>🎯 AI Quizzer</h1>
        <CreateQuiz onQuizCreated={(newId) => setQuizId(newId)} />
        <div style={{ height: '1px', background: '#ddd', margin: '30px 0' }} />
        <p style={{ color: '#aaa' }}>...or join an existing one</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: '#333' }}
            placeholder="Enter Quiz ID" 
            value={quizId} 
            onChange={(e) => setQuizId(e.target.value)} 
          />
          <input 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', color: '#333' }}
            placeholder="Your Name" 
            value={studentId} 
            onChange={(e) => setStudentId(e.target.value)} 
          />
          <button onClick={handleJoin} style={{ padding: '12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // --- UI Logic: 2. Result Screen ---
  if (score) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '700px', margin: '0 auto' }}>
        
        {/* 📄 PDF Capture Area */}
        <div ref={reportRef} style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #ddd' }}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #646cff', paddingBottom: '20px', marginBottom: '20px' }}>
            <h2 style={{ color: '#1a1a1a', marginTop: 0 }}>🎉 Official Quiz Report</h2>
            <h3 style={{ color: '#666', margin: '10px 0' }}>Topic: {quiz.prompt}</h3>
            <p style={{ color: '#1a1a1a' }}>Student: <strong>{studentId}</strong></p>
            {timeLeft === 0 && <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>⏰ Time expired automatically</p>}
            <h1 style={{ fontSize: '48px', color: '#2ecc71', margin: '10px 0' }}>{score.score} / {score.total}</h1>
          </div>

          <div style={{ textAlign: 'left' }}>
            <h3 style={{ color: '#1a1a1a' }}>Detailed Breakdown:</h3>
            {quiz.questions && quiz.questions.map((q, i) => {
              const isCorrect = userAnswers[i] === q.correctAnswer;
              return (
                <div key={i} style={{ marginBottom: '15px', padding: '15px', background: isCorrect ? '#f0fdf4' : '#fef2f2', borderRadius: '8px', border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}` }}>
                  <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#1a1a1a' }}>{i + 1}. {q.question}</p>
                  <p style={{ margin: '5px 0', color: '#333' }}>
                    Your Answer: <span style={{ fontWeight: 'bold', color: isCorrect ? '#16a34a' : '#dc2626' }}>{userAnswers[i] || "Did not answer"}</span>
                  </p>
                  {!isCorrect && (
                    <p style={{ margin: '5px 0', color: '#333' }}>
                      Correct Answer: <span style={{ fontWeight: 'bold', color: '#16a34a' }}>{q.correctAnswer}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          <button onClick={downloadPDF} style={{ flex: 1, padding: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
            📥 Download PDF Report
          </button>
          <button onClick={() => window.location.reload()} style={{ flex: 1, padding: '15px', backgroundColor: '#f3f4f6', color: '#333', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
            Take Another Quiz
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <Leaderboard quizId={quizId} socket={socket} />
        </div>
      </div>
    );
  }

  // --- UI Logic: 3. Active Quiz ---
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '700px', margin: '0 auto' }}>
      <header style={{ borderBottom: '2px solid #646cff', marginBottom: '30px', paddingBottom: '10px' }}>
        <h2 style={{ color: '#1a1a1a', margin: '0 0 15px 0' }}>📝 {quiz.prompt}</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#666', margin: 0 }}>Student: <strong>{studentId}</strong></p>
          <div style={{ 
            background: timeLeft <= 10 ? '#ffeaeb' : '#f0fdf4', 
            color: timeLeft <= 10 ? '#dc2626' : '#16a34a', 
            padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', 
            border: `2px solid ${timeLeft <= 10 ? '#ef4444' : '#22c55e'}`,
            display: 'flex', alignItems: 'center', gap: '5px'
          }}>
            ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </header>
      
      <main>
        {quiz.questions && quiz.questions.map((q, index) => (
          <div key={index} style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #ddd' }}>
            <h3 style={{ color: '#1a1a1a', marginTop: '0' }}>{index + 1}. {q.question}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {q.options.map((opt, i) => {
                const isSelected = userAnswers[index] === opt;
                return (
                  <button 
                    key={i} 
                    onClick={() => setUserAnswers({ ...userAnswers, [index]: opt })}
                    style={{ 
                      padding: '12px', textAlign: 'left', cursor: 'pointer', borderRadius: '8px',
                      border: isSelected ? '2px solid #646cff' : '1px solid #ddd',
                      backgroundColor: isSelected ? '#f0f0ff' : 'white', color: '#333' 
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button 
          onClick={handleSubmit}
          style={{ width: '100%', padding: '15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' }}
        >
          Submit Quiz
        </button>

        <Leaderboard quizId={quizId} socket={socket} />
      </main>
    </div>
  );  
}

export default App;