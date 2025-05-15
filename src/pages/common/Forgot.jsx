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
        headers: { 'Content-Type': 'application/json' },
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
      <div className="wrapper">
        <div className="blur-bg"></div>
        <div className="login-content">
          <h1 className="headline">Reset Your <span className="highlight">Password</span></h1>

          <form className="login-form" onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="login-button">Change Password</button>
          </form>

          <div className="login-links">
            Remember your password? <a href="/">Login here</a>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          height: 100%;
          font-family: 'Inter', sans-serif;
          background-color: #0f0f11;
          color: white;
        }

        .wrapper {
          height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at top left, #1e1e26, #0f0f11);
          position: relative;
          overflow: hidden;
        }

        .blur-bg {
          position: absolute;
          top: -200px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: #3b82f6;
          opacity: 0.2;
          filter: blur(150px);
          z-index: 0;
        }

        .login-content {
          z-index: 10;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
        }

        .headline {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 30px;
          text-align: center;
          background: linear-gradient(to right, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .highlight {
          color: #38bdf8;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 6px;
          color: #cbd5e1;
        }

        .form-group input,
        .form-group select {
          padding: 12px;
          border: 1px solid #475569;
          border-radius: 10px;
          background-color: #1e293b;
          color: white;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #38bdf8;
        }

        .login-button {
          padding: 14px;
          background: linear-gradient(to right, #3b82f6, #06b6d4);
          border: none;
          border-radius: 10px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .login-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }

        .login-links {
          margin-top: 20px;
          text-align: center;
          font-size: 14px;
          color: #94a3b8;
        }

        .login-links a {
          color: #38bdf8;
          text-decoration: none;
        }

        .login-links a:hover {
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .headline {
            font-size: 24px;
          }

          .login-content {
            padding: 30px 20px;
          }
        }
      `}</style>
    </>
  );
}
