import React, { useEffect, useState } from 'react';

export default function HistoryPage({ token }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('http://localhost:5000/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchHistory();
  }, [token]);

  return (
    <div>
      <h2>History</h2>
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul>
          {history.map((item) => (
            <li key={item._id} style={{ marginBottom: '10px' }}>
              <strong>Text:</strong> {item.text} <br />
              <strong>Verdict:</strong> {item.verdict} <br />
              <strong>Reasoning:</strong> {item.reasoning} <br />
              <strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
