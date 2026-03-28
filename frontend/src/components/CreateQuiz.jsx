import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2 } from 'lucide-react';

function CreateQuiz({ onQuizCreated }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return alert("Please enter a topic!");
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/quiz/create', { prompt });
      // The backend returns the full quiz object
      onQuizCreated(res.data.id || res.data.quizId); 
    } catch (err) {
      alert("AI Generation failed. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f8faff', borderRadius: '12px', border: '2px dashed #646cff', marginBottom: '30px' }}>
      <h3 style={{ marginTop: 0, color: '#1a1a1a' }}>🚀 Create AI Quiz</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          placeholder="e.g. React Hooks, Indian History, Space Exploration..." 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <button 
          onClick={handleGenerate}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            background: '#646cff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
}

export default CreateQuiz;