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
          navigate('/dashboard', { state: { userEmail: email } });
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
      <div className="wrapper">
        <div className="blur-bg"></div>
        <div className="login-content">
          <h1 className="headline">Log In as <span className="highlight">{role || 'User'}</span></h1>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button className="login-button" type="submit">Login</button>
          </form>

          <div className="social-login">
            <p className="or-separator">or login with</p>
            <div className="social-buttons">
              <button className="social-button google" onClick={() => alert('Google login coming soon')}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" />
                Google
              </button>
              <button className="social-button github" onClick={() => alert('GitHub login coming soon')}>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" />
                GitHub
              </button>
            </div>
          </div>

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
          font-size: 36px;
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

        .form-group input {
          padding: 12px;
          border: 1px solid #475569;
          border-radius: 10px;
          background-color: #1e293b;
          color: white;
        }

        .form-group input:focus {
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

        .social-login {
          margin-top: 30px;
          text-align: center;
        }

        .or-separator {
          margin-bottom: 10px;
          color: #cbd5e1;
        }

        .social-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .social-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border: 1px solid #475569;
          border-radius: 8px;
          background-color: #1e293b;
          color: white;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .social-button img {
          width: 20px;
          height: 20px;
        }

        .social-button:hover {
          background-color: #334155;
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
            font-size: 28px;
          }

          .login-content {
            padding: 30px 20px;
          }
        }
      `}</style>
    </>
  );
}
