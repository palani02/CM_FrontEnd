import { useNavigate } from 'react-router-dom';
// First Page, Role Selection
export function RoleSelection() {
  const navigate = useNavigate();
  return (
    <>
      <div className="role-container">
        <h1 className="project-name">Course Scheduler System</h1>
        <h2 className="role-title">Choose Your Role</h2>

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

      <style>{`
        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
        background: linear-gradient(to top right, #003366, #3366cc);
        }

        .role-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          
        }

        .project-name {
          font-size: 48px;
          font-weight: 700;
          color: #e0f2fe;
          margin-bottom: 20px;
          text-align: center;
        }

        .role-title {
          font-size: 28px;
          font-weight: 500;
          color: #bae6fd;
          margin-bottom: 40px;
          text-align: center;
        }

        .role-buttons {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .role-button {
          padding: 16px 40px;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          background-color: #334155;
          transition: all 0.3s ease;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .role-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .student-button {
          background-color: #3b82f6;
        }

        .student-button:hover {
          background-color: #2563eb;
        }

        .admin-button {
          background-color: #06b6d4;
        }

        .admin-button:hover {
          background-color: #0891b2;
        }

        @media (max-width: 600px) {
          .role-buttons {
            flex-direction: column;
            gap: 20px;
          }

          .role-button {
            width: 100%;
            font-size: 16px;
            padding: 14px 20px;
          }

          .project-name {
            font-size: 36px;
          }

          .role-title {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}
