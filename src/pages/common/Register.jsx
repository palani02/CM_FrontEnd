import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Register() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const registerData = { email, password };
    console.log("Register Data:", registerData);

    try {
      const response = await fetch(`http://localhost:8088/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        navigate('/'); // Redirect to login after success
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration');
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="register-box">
          <h1 className="register-title">Register as Student</h1>

          <form onSubmit={handleRegister} className="register-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="register-input"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="register-input"
            />

            <button type="submit" className="register-button">
              Register
            </button>
          </form>

          <p className="register-footer">
            Already have an account?{' '}
            <a href="/" className="register-link">Login here</a>
          </p>
        </div>
      </div>

      {/* PURE CSS Styling */}
      <style>{`
        .register-container {
          min-height: 100vh;
          background: linear-gradient(to bottom right, #e0f2fe, #f0f9ff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Segoe UI', sans-serif;
          padding: 20px;
        }

        .register-box {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .register-title {
          font-size: 26px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 25px;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .register-input {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s;
        }

        .register-input:focus {
          border-color: #3b82f6;
          outline: none;
        }

        .register-button {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .register-button:hover {
          background-color: #2563eb;
        }

        .register-footer {
          margin-top: 20px;
          font-size: 14px;
          color: #555;
        }

        .register-link {
          color: #3b82f6;
          text-decoration: none;
        }

        .register-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .register-box {
            padding: 20px;
          }

          .register-title {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}
