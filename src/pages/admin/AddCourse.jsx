import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminUnenrollRequests from "./AdminUnenrollRequests"; 

export function AddCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    duration: "",
    session: "",
    totalSlots: "",
    filledSlots: ""
  });
  const [view, setView] = useState("course");
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    if (["students", "remove-student"].includes(view)) {
      axios.get("http://localhost:8088/api/courses/enrollments-list-all")
        .then((res) => setEnrolledStudents(res.data))
        .catch((err) => console.error("Error fetching students:", err));
    } else if (view === "remove") {
      axios.get("http://localhost:8088/api/courses/available")
        .then((res) => setAvailableCourses(res.data))
        .catch((err) => console.error("Error fetching courses:", err));
    }
  }, [view]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8088/api/courses", {
        ...form,
        totalSlots: parseInt(form.totalSlots),
        filledSlots: parseInt(form.filledSlots)
      });
      alert("Course added!");
      setForm({ name: "", duration: "", session: "", totalSlots: "", filledSlots: "" });
    } catch (err) {
      console.error(err);
      alert("Error adding course");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course?")) {
      try {
        const res = await axios.delete(`http://localhost:8088/api/courses/delete-course-by-id?courseId=${id}`);
        if (res.data === "Course deleted successfully.") {
          setAvailableCourses(prev => prev.filter(c => c.id !== id));
          alert("Deleted");
        } else alert(res.data);
      } catch (err) {
        alert("Failed to delete course.");
      }
    }
  };

  const handleStudentRemove = async (email) => {
    if (window.confirm(`Remove student ${email}?`)) {
      try {
        await axios.delete(`http://localhost:8088/api/courses/remove-student?studentEmail=${email}`);
        setEnrolledStudents(prev => prev.filter(s => s.studentEmail !== email));
        alert("Removed");
      } catch (err) {
        alert("Failed to remove student");
      }
    }
  };

  const handleLogout = () => navigate("/");

  const filteredStudents = selectedCourse === "All"
    ? enrolledStudents
    : enrolledStudents.filter(s => s.courseName === selectedCourse);

  const paginate = (students) => {
    const start = (currentPage - 1) * studentsPerPage;
    return students.slice(start, start + studentsPerPage);
  };

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <>
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="layout">
        <aside>
          <h2>Dashboard</h2>
          <button className={view === "course" ? "active" : ""} onClick={() => setView("course")}>Add New Course</button>
          <button className={view === "students" ? "active" : ""} onClick={() => setView("students")}>Enrolled Students</button>
          <button className={view === "remove" ? "active" : ""} onClick={() => setView("remove")}>Remove Course</button>
          <button className={view === "remove-student" ? "active" : ""} onClick={() => setView("remove-student")}>Remove Student</button>
          <button className={view === "unenroll-requests" ? "active" : ""} onClick={() => setView("unenroll-requests")}>Unenroll Requests</button>
        </aside>

        <main>
          {view === "course" && (
            <div className="form-box">
              <h2 className="form-title">Add New Course</h2>
              <form onSubmit={handleSubmit} className="form-body">
                {Object.keys(form).map((field, i) => (
                  <input
                    key={i}
                    type={field.includes("Slot") ? "number" : "text"}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    required
                    className="input-field"
                  />
                ))}
                <button type="submit" className="submit-button">Add Course</button>
              </form>
            </div>
          )}

          {view === "students" && (
            <div className="form-box-enrolledStudent">
              <h2 className="form-title">Enrolled Students</h2>
              <div className="filter-container">
                <label htmlFor="courseFilter">Filter by Course:</label>
                <select id="courseFilter" onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
                  <option value="All">All Courses</option>
                  {availableCourses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>

              {filteredStudents.length ? (
                <>
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Session</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginate(filteredStudents).map((student, index) => (
                        <tr key={index}>
                          <td>{student.studentEmail}</td>
                          <td>{student.courseName}</td>
                          <td>{student.session}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination">
                    <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
                  </div>
                </>
              ) : <p>No students enrolled yet.</p>}
            </div>
          )}

          {view === "remove" && (
            <div className="form-box-enrolledStudent">
              <h2 className="form-title">Remove Courses</h2>
              {availableCourses.length ? (
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Session</th>
                      <th>Duration</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableCourses.map(course => (
                      <tr key={course.id}>
                        <td>{course.name}</td>
                        <td>{course.session}</td>
                        <td>{course.duration}</td>
                        <td><button onClick={() => handleDelete(course.id)}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No courses to delete.</p>}
            </div>
          )}

          {view === "remove-student" && (
            <div className="form-box-enrolledStudent">
              <h2 className="form-title">Remove Students</h2>
              {enrolledStudents.length ? (
                <>
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Session</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginate(enrolledStudents).map((student, index) => (
                        <tr key={index}>
                          <td>{student.studentEmail}</td>
                          <td>{student.courseName}</td>
                          <td>{student.session}</td>
                          <td>
                            <button
                              onClick={() => handleStudentRemove(student.studentEmail)}
                              style={{ backgroundColor: "#F44336", color: "#fff" }}>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination">
                    <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
                  </div>
                </>
              ) : <p>No students to remove.</p>}
            </div>
          )}

          {view === "unenroll-requests" && (
            <div className="form-box-enrolledStudent">
              <AdminUnenrollRequests />
            </div>
          )}
        </main>
      </div>
<style>{`
.form-box-enrolledStudent {
  background: #2e3b4e;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  color: white;
}

.student-table th, .student-table td {
  padding: 12px;
  border: 1px solid #ccc;
  color: white;
}

.student-table th {
  background-color: #4CAF50;
}

  body {
    font-family: 'Inter', sans-serif;
    background-color: #1e293b; /* dark background */
    margin: 0;
    padding: 0;
    color: white; /* white text color for better contrast */
  }

  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2196F3; /* blue header */
    color: white;
    padding: 0 20px;
    font-size: 18px;
    z-index: 1000;
  }

  header h1 {
    margin: 0;
  }

  .top-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .student-name-header {
    font-size: 16px;
    color: #facc15; /* yellow accent color */
  }

  button {
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    font-weight: bold;
    background: linear-gradient(to right, #3b82f6, #06b6d4); /* gradient button color */
    border: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  .layout {
    display: flex;
    min-height: 100vh;
    padding-top: 70px;
  }

  aside {
    position: fixed;
    top: 70px;
    left: 0;
    width: 260px;
    background: #1e293b; /* dark background for aside */
    color: white;
    padding: 30px 20px;
    height: calc(100vh - 70px);
  }

  aside button {
    background: transparent;
    color: #38bdf8; /* blue accent color for button */
    border: none;
    padding: 12px;
    margin-bottom: 16px;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  aside button.active {
    background-color: #38bdf8;
    color: white;
    font-weight: bold;
    border-radius: 6px;
  }

  main {
    flex: 1;
    margin-left: 300px;
    padding: 50px 40px;
    background: #1e293b; /* dark background for main content */
    height: calc(100vh - 70px);
    overflow-y: auto;
  }

  .form-box, .form-box-enrolledStudent {
    background: #2e3b4e; /* dark card background */
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    width: 50%;
    max-width: 800px;
    margin: 0 auto;
    color: white; /* white text color for forms */
  }

  .form-title {
    font-size: 24px;
    font-weight: bold;
    color: #F44336; /* red title for emphasis */
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
    border: 1px solid #2196F3; /* blue border */
    border-radius: 8px;
    transition: border-color 0.3s;
    color: white; /* white text color in input fields */
    background: #2e3b4e; /* dark background for input fields */
  }

  .input-field:focus {
    outline: none;
    border-color: #4CAF50; /* green border on focus */
  }

  .submit-button {
    background: #4CAF50; /* green button */
    color: white;
    padding: 12px;
    font-size: 16px;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.3s;
  }

  .submit-button:hover {
    opacity: 0.9;
  }

  .course-title {
    font-size: 22px;
    font-weight: bold;
    color: #F44336; /* red title for course */
    margin-bottom: 20px;
    text-align: center;
  }

  .student-card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }

  .student-card {
    background-color: #2e3b4e; /* dark background for student cards */
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 280px;
    transition: transform 0.2s;
    text-align: center;
    color: #ffffff; /* white text for card */
  }

  .student-card:hover {
    transform: translateY(-5px);
  }

  .student-card h4 {
    margin-top: 0;
    font-size: 18px;
  }

  .student-card p {
    margin: 6px 0;
    font-size: 14px;
  }

  .student-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .student-table th, .student-table td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
    color: white; /* white text inside the table */
  }

  .student-table th {
    background-color: #4CAF50; /* green header */
    color: white;
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .pagination button {
    background: #F44336; /* red button */
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  .pagination button:disabled {
    background-color: #eee;
    color: #999;
    cursor: not-allowed;
  }

  /* Toast notification */
  .toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transition: opacity 0.3s ease;
    z-index: 1000;
  }

  .toast.success {
    background-color: #4caf50;
  }

  .toast.error {
    background-color: #f44336;
  }

  @media (max-width: 480px) {
    .layout {
      flex-direction: column;
    }
    main {
      margin-left: 0;
    }
    .form-box, .form-box-enrolledStudent {
      padding: 20px;
    }
    .form-title {
      font-size: 20px;
    }
    aside {
      position: relative;
      width: 100%;
      height: auto;
      margin-bottom: 20px;
    }
  }
`}</style>
    </>
  );
}
