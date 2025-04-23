import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function AddCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    duration: "",
    session: "",
    totalSlots: "",
    filledSlots: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8088/api/courses", {
        ...form,
        totalSlots: parseInt(form.totalSlots),
        filledSlots: parseInt(form.filledSlots)
      });
      alert("Course added successfully!");
      setForm({
        name: "",
        duration: "",
        session: "",
        totalSlots: "",
        filledSlots: ""
      });
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Failed to add course.");
    }
  };

  const handleLogout = () => {
    // Add any logout logic here (e.g. clearing localStorage/session)
    navigate("/"); // Redirect to login or home
  };

  return (
    <>
      <div className="add-course-container">
        <div className="top-bar">
          <div className="admin-profile">👤 Admin</div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>

        <div className="form-box">
          <h2 className="form-title">Add New Course</h2>
          <form onSubmit={handleSubmit} className="form-body">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Course Name"
              required
              className="input-field"
            />
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Duration"
              required
              className="input-field"
            />
            <input
              type="text"
              name="session"
              value={form.session}
              onChange={handleChange}
              placeholder="Session"
              required
              className="input-field"
            />
            <input
              type="number"
              name="totalSlots"
              value={form.totalSlots}
              onChange={handleChange}
              placeholder="Total Slots"
              required
              className="input-field"
            />
            <input
              type="number"
              name="filledSlots"
              value={form.filledSlots}
              onChange={handleChange}
              placeholder="Filled Slots"
              required
              className="input-field"
            />
            <button type="submit" className="submit-button">Add Course</button>
          </form>
        </div>
      </div>

      <style>{`
        .add-course-container {
          min-height: 100vh;
          background: linear-gradient(to bottom right, #eef2ff, #f5f3ff);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
        }

        .top-bar {
          width: 100%;
          max-width: 1000px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 20px;
        }

        .admin-profile {
          margin-right: 16px;
          font-weight: 500;
          color: #4f46e5;
        }

        .logout-button {
          background-color: #ef4444;
          color: white;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .logout-button:hover {
          background-color: #dc2626;
        }

        .form-box {
          background-color: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 500px;
        }

        .form-title {
          font-size: 24px;
          font-weight: bold;
          color: #4f46e5;
          margin-bottom: 24px;
          text-align: center;
        }

        .form-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-field {
          padding: 12px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 8px;
          transition: border-color 0.3s;
        }

        .input-field:focus {
          outline: none;
          border-color: #6366f1;
        }

        .submit-button {
          background-color: #6366f1;
          color: white;
          padding: 12px;
          font-size: 16px;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .submit-button:hover {
          background-color: #4f46e5;
        }

        @media (max-width: 480px) {
          .form-box {
            padding: 20px;
          }

          .form-title {
            font-size: 20px;
          }

          .top-bar {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
