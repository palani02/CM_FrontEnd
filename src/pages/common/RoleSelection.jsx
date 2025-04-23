import { useNavigate } from 'react-router-dom';

export function RoleSelection() {
  const navigate = useNavigate();

  return (
    <>
      <div className="role-container">
        {/* Project Name */}
        <h1 className="project-name">Course Management System</h1>

        {/* Page Title */}
        <h2 className="role-title">Select Your Role</h2>

        {/* Role Buttons */}
        <div className="role-buttons">
          <button
            onClick={() => navigate('/login?role=student')}
            className="role-button student-button"
          >
            Student
          </button>
          <button
            onClick={() => navigate('/login?role=admin')}
            className="role-button admin-button"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Pure CSS Styles */}
      <style>{`
        .role-container {
          height: 100vh;
          background: linear-gradient(to bottom right, #e0e7ff, #f3e8ff);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
          padding: 20px;
        }

        .project-name {
          font-size: 36px;
          font-weight: 700;
          color: #2b2b2b;
          font-family: 'Georgia', 'Times New Roman', serif;
          margin-bottom: 10px;
          text-align: center;
          letter-spacing: 0.5px;
        }

        .role-title {
          font-size: 24px;
          color: #444;
          font-weight: 600;
          margin-bottom: 30px;
          text-align: center;
        }

        .role-buttons {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .role-button {
          padding: 12px 28px;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          background-color: #6c63ff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .role-button:hover {
          transform: translateY(-3px);
        }

        .student-button {
          background-color: #4f46e5;
        }

        .student-button:hover {
          background-color: #4338ca;
        }

        .admin-button {
          background-color: #9333ea;
        }

        .admin-button:hover {
          background-color: #7e22ce;
        }

        @media (max-width: 500px) {
          .role-buttons {
            flex-direction: column;
            gap: 15px;
            width: 100%;
            padding: 0 20px;
          }

          .role-button {
            width: 100%;
          }

          .project-name {
            font-size: 28px;
          }

          .role-title {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
}
