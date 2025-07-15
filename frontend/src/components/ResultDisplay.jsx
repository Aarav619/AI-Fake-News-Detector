import React from 'react';

export default function ResultDisplay({ result }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h2>Verdict: {result.verdict}</h2>
      <p>{result.reasoning}</p>
      <ul>
        {result.sources.map((url, i) => (
          <li key={i}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
        ))}
      </ul>
    </div>
  );
}
