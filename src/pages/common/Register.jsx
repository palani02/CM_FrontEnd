import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// New student registration page
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
        navigate('/');  
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

     <style>{`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Inter', sans-serif;
  }

  .register-container {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(to top right, #003366, #3366cc);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .register-box {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .register-title {
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 20px;
    color: #003366;
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .register-input {
    padding: 12px;
    border: 1px solid #cccccc;
    border-radius: 8px;
    font-size: 14px;
    color: #003366;
    background-color: #f4f4f4;
    transition: border-color 0.3s;
  }

  .register-input:focus {
    border-color: #1e90ff;
    outline: none;
  }

  .register-button {
    padding: 12px;
    background-color: #1e90ff;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .register-button:hover {
    background-color: #4682b4;
  }

  .register-footer {
    margin-top: 15px;
    text-align: center;
    font-size: 14px;
    color: #003366;
  }

  .register-link {
    color: #1e90ff;
    text-decoration: none;
  }

  .register-link:hover {
    text-decoration: underline;
  }
`}</style>

    </>
  );
}
