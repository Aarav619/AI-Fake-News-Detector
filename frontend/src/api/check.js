const API_URL = process.env.REACT_APP_API_URL;

export async function checkText(text, token) {
  const res = await fetch(`${API_URL}/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
