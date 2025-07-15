import React, { useState } from 'react';

export default function CheckForm({ onResult, token }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('http://localhost:5000/check', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    setLoading(false);
    onResult(data.error ? { verdict: 'ERROR', reasoning: data.error, sources: [] } : data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows="6"
        style={{ width: '100%' }}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Checking...' : 'Check News'}
      </button>
    </form>
  );
}
