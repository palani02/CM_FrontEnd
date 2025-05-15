import { useNavigate } from 'react-router-dom';

export function RoleSelection() {
  const navigate = useNavigate();

  return (
    <>
      <div className="wrapper">
        <div className="blur-bg"></div>
        <div className="content">
          <h1 className="headline">Course Scheduler</h1>
          <p className="subheadline">
            A beautifully simple way to plan, manage, and track academic schedules. Choose your role to begin.
          </p>

          <div className="role-cards">
            <div className="card" onClick={() => navigate('/login?role=student')}>
              <h2>🎓 Student</h2>
              <p>Organize your classes and schedules effortlessly.</p>
            </div>

            <div className="card" onClick={() => navigate('/login?role=admin')}>
              <h2>🛠️ Admin</h2>
              <p>Manage courses, users, and everything in between.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
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

        .content {
          z-index: 10;
          max-width: 800px;
          text-align: center;
          padding: 40px;
        }

        .headline {
          font-size: 56px;
          font-weight: 800;
          margin-bottom: 20px;
          background: linear-gradient(to right, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subheadline {
          font-size: 20px;
          color: #94a3b8;
          margin-bottom: 50px;
        }

        .role-cards {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 30px;
          width: 280px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-4px) scale(1.02);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .card h2 {
          font-size: 24px;
          margin-bottom: 12px;
          color: #f1f5f9;
        }

        .card p {
          color: #94a3b8;
          font-size: 16px;
        }

        @media (max-width: 600px) {
          .headline {
            font-size: 36px;
          }

          .subheadline {
            font-size: 18px;
          }

          .role-cards {
            flex-direction: column;
          }

          .card {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
