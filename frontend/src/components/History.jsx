import React, { useEffect, useState } from 'react';

export default function History({ token }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!token) return;
        const fetchHistory = async () => {
            try {
                const res = await fetch('http://localhost:5000/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setHistory(data.history || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, [token]);

    return (
        <div>
            <h2>History</h2>
            {history.length === 0 ? (
                <p>No history available.</p>
            ) : (
                <ul>
                    {history.map((item) => (
                        <li key={item._id}>
                            <strong>{item.verdict}</strong>: {item.reasoning}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
