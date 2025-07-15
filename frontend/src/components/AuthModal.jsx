import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthModal({ onClose, onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">X</button>
        {showLogin ? (
          <LoginForm
            onLogin={onLogin}
            onSwitch={() => setShowLogin(false)}
          />
        ) : (
          <SignupForm
            onSignup={onLogin}
            onSwitch={() => setShowLogin(true)}
          />
        )}
      </div>
    </div>
  );
}
