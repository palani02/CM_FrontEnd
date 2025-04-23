import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = new URLSearchParams(location.search).get('role');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = { email, password, role };

    try {
      const response = await fetch(`http://localhost:8088/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        if (result.role === "student") {
          navigate('/dashboard');
        } else if (result.role === "admin") {
          navigate('/add-course');
        }
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">
            Sign In as <span className="login-role">{role || 'User'}</span>
          </h2>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <div className="login-links">
            {role !== 'admin' && (
              <>
                New here? <a href="/Register">Register now</a> |{" "}
              </>
            )}
            <a href="/Forgot">Forgot Password?</a>
          </div>
        </div>
      </div>

      {/* Pure CSS Styling */}
      <style>{`
        .login-container {
          min-height: 100vh;
          background: linear-gradient(to top right, #f0f4ff, #ffffff);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Segoe UI', sans-serif;
          padding: 20px;
        }

        .login-card {
          background-color: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .login-title {
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .login-role {
          color: #2563eb; /* nice blue */
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

        .form-group input {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s;
        }

        .form-group input:focus {
          border-color: #2563eb;
          outline: none;
        }

        .login-button {
          padding: 12px;
          background-color: #2563eb;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .login-button:hover {
          background-color: #1d4ed8;
        }

        .login-links {
          margin-top: 15px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }

        .login-links a {
          color: #2563eb;
          text-decoration: none;
        }

        .login-links a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
