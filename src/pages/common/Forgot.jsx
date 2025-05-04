import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Forgot password
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
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Reset Your Password</h2>

          <form onSubmit={handleForgotPassword} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
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
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: 'Inter', sans-serif;
        }

        .login-container {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(to top right, #003366, #3366cc);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .login-card {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .login-title {
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 20px;
          color: #003366;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 5px;
          color: #555;
        }

        .form-group input,
        .form-group select {
          padding: 12px;
          border: 1px solid #cccccc;
          border-radius: 8px;
          font-size: 14px;
          color: #003366;
          background-color: #f4f4f4;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #1e90ff;
          outline: none;
        }

        .login-button {
          padding: 12px;
          background-color: #1e90ff;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .login-button:hover {
          background-color: #4682b4;
        }

        .login-links {
          margin-top: 15px;
          text-align: center;
          font-size: 14px;
          color: #003366;
        }

        .login-links a {
          color: #1e90ff;
          text-decoration: none;
        }

        .login-links a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
