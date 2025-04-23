import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const data = { email, currentPassword, newPassword, role };

    try {
      const response = await fetch(`http://localhost:8088/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Password reset successful!');
        navigate('/');
      } else {
        alert(result.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      alert('An error occurred while resetting password');
    }
  };

  return (
    <>
      <div className="forgot-container">
        <div className="forgot-box">
          <h1 className="forgot-title">Reset Your Password</h1>

          <form onSubmit={handleForgotPassword} className="forgot-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="forgot-input"
            />

            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="forgot-input"
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="forgot-input"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="forgot-input"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" className="forgot-button">
              Change Password
            </button>
          </form>

          <p className="forgot-footer">
            Remember your password?{' '}
            <a href="/" className="forgot-link">
              Login here
            </a>
          </p>
        </div>
      </div>

      {/* PURE CSS STYLING */}
      <style>{`
        .forgot-container {
          min-height: 100vh;
          background: linear-gradient(to bottom right, #eef2ff, #f5f3ff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Segoe UI', sans-serif;
          padding: 20px;
        }

        .forgot-box {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .forgot-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 24px;
        }

        .forgot-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .forgot-input {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
        }

        .forgot-button {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .forgot-button:hover {
          background-color: #2563eb;
        }

        .forgot-footer {
          margin-top: 20px;
          font-size: 14px;
          color: #555;
        }

        .forgot-link {
          color: #3b82f6;
          text-decoration: none;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .forgot-box {
            padding: 20px;
          }

          .forgot-title {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
}
