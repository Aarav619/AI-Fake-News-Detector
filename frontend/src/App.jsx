import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CheckForm from './components/CheckForm';
import ResultDisplay from './components/ResultDisplay';
import AuthModal from './components/AuthModal';
import History from './components/History';
import './styles.css'; // Ensure this file exists

function App() {
  const [result, setResult] = useState(null);
  const [token, setToken] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setToken(null);
    setShowHistory(false);
  };

  const handleToggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  return (
    <div className="container">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📰 Fake News Checker
      </motion.h1>

      <div className="nav-bar">
        {token ? (
          <>
            <button onClick={handleToggleHistory} className="history-toggle">
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
            <button onClick={handleLogout} className="nav-button logout-button">
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => setShowAuth(true)} className="nav-button login-button">
            Login
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="content-section"
      >
        {token && showHistory && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <History token={token} />
          </motion.div>
        )}

        <CheckForm onResult={setResult} token={token} />
        {result && <ResultDisplay result={result} />}
      </motion.div>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
