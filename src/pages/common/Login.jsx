 import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Common Login page for both "Student" and "Admin", based on the Role it redirect
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
      // until get the response it wait(await)
      const response = await fetch(`http://localhost:8088/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), // convert object into json
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
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">
            Log In as <span className="login-role">{role || 'User'}</span>
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
    background: linear-gradient(to top right, #003366, #3366cc); /* Blueish gradient */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

        .login-card {
          background-color: #ffffff; /* White background for the card */
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

        .login-role {
          color: #1e90ff; /* Lighter blue for the role */
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
          padding: 12px;
          border: 1px solid #cccccc; /* Light grey border */
          border-radius: 8px;
          font-size: 14px;
          color: #003366; /* Dark text color */
          background-color: #f4f4f4;
          transition: border-color 0.3s;
        }

        .form-group input:focus {
          border-color: #1e90ff; /* Blue focus border */
          outline: none;
        }

        .login-button {
          padding: 12px;
          background-color: #1e90ff; /* Blue button */
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .login-button:hover {
          background-color: #4682b4; /* Darker blue on hover */
        }

        .login-links {
          margin-top: 15px;
          text-align: center;
          font-size: 14px;
          color: #003366;
        }

        .login-links a {
          color: #1e90ff; /* Blue links */
          text-decoration: none;
        }

        .login-links a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}