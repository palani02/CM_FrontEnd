import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Admin Credential matches, then this is page where admin redirect
// Admin Dashboard
export function AddCourse() {
  // Hooks
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

  // Page Count, Show 5 student list at a time, then remaining goes next page
  const studentsPerPage = 5; 

  useEffect(() => {
    if (view === "students" || view === "remove-student") {
      axios.get("http://localhost:8088/api/courses/enrollments-list-all")
        .then((response) => {
          setEnrolledStudents(response.data);
        })
        .catch((error) => console.error("Error fetching enrolled students:", error));
    } else if (view === "remove") {
      axios.get("http://localhost:8088/api/courses/available")
        .then((response) => setAvailableCourses(response.data))
        .catch((error) => console.error("Error fetching courses:", error));
    }
  }, [view]);

  const handleChange = (e) => {
    // Using Spread Operator to change the state
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
      setForm({ name: "", duration: "", session: "", totalSlots: "", filledSlots: "" });
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Failed to add course.");
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:8088/api/courses/delete-course-by-id?courseId=${courseId}`);
        setAvailableCourses(prev => prev.filter(course => course.id !== courseId));
        alert("Course deleted successfully!");
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course.");
      }
    }
  };

  const handleStudentRemove = async (email) => {
    if (window.confirm(`Are you sure you want to remove student: ${email}?`)) {
      try {
        await axios.delete(`http://localhost:8088/api/courses/remove-student?studentEmail=${email}`);
        setEnrolledStudents(prev => prev.filter(student => student.studentEmail !== email));
        alert("Student removed successfully!");
      } catch (error) {
        console.error("Error removing student:", error);
        alert("Failed to remove student.");
      }
    }
  };
   
  const handleLogout = () => {
    // redirect to role selection page
    navigate("/");
  };

  const filteredStudents = selectedCourse === "All" 
    ? enrolledStudents
    : enrolledStudents.filter(student => student.courseName === selectedCourse);

    // Pagination to filter student list 
  const paginate = (students) => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    return students.slice(startIndex, startIndex + studentsPerPage);
  };

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <>
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="layout">
      {/* Admin sidebar */}
        <aside>
          <h2>Dashboard</h2>
          <button className={view === "course" ? "active" : ""} onClick={() => setView("course")}>Add New Course</button>
          <button className={view === "students" ? "active" : ""} onClick={() => setView("students")}>Enrolled Students</button>
          <button className={view === "remove" ? "active" : ""} onClick={() => setView("remove")}>Remove Course</button>
          <button className={view === "remove-student" ? "active" : ""} onClick={() => setView("remove-student")}>Remove Student</button>
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
                <select 
                  id="courseFilter" 
                  onChange={(e) => setSelectedCourse(e.target.value)} 
                  value={selectedCourse}
                >
                  <option value="All">All Courses</option>
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>

              {filteredStudents.length > 0 ? (
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
              ) : (
                <p>No students enrolled yet.</p>
              )}

              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {view === "remove" && (
            <div className="form-box-enrolledStudent">
              <h2 className="form-title">Remove Courses</h2>
              {availableCourses.length > 0 ? (
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Session</th>
                      <th>Duration</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableCourses.map((course, idx) => (
                      <tr key={idx}>
                        <td>{course.name}</td>
                        <td>{course.session}</td>
                        <td>{course.duration}</td>
                        <td>
                          <button onClick={() => handleDelete(course.id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No available courses to delete.</p>
              )}
            </div>
          )}

          {view === "remove-student" && (
            <div className="form-box-enrolledStudent">
              <h2 className="form-title">Remove Students</h2>
              {enrolledStudents.length > 0 ? (
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
                          <button onClick={() => handleStudentRemove(student.studentEmail)} style={{ backgroundColor: "#F44336", color: "#fff" }}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No students to remove.</p>
              )}

              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
  <style>{`
  body {
    font-family: 'Inter', sans-serif;
    background-color: #F0FAFF; /* light blue background */
    margin: 0;
    padding: 0;
    color: #212121;
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
    background: #2196F3; /* solid blue */
    color: #ffffff;
    padding: 0 20px;
    font-size: 18px;
    font-weight: 600;
    z-index: 1000;
  }

  header h1 {
    margin: 0;
  }

  button {
    background: #F44336; /* solid red */
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }

  button:hover {
    opacity: 0.85;
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
    background: #DFF6FF; /* light blue */
    color: #1A1A1A;
    padding: 30px 20px;
    height: calc(100vh - 70px);
    z-index: 999;
  }

  aside h2 {
    font-size: 24px;
    margin-bottom: 16px;
  }

  aside button {
    background: transparent;
    color: #4CAF50; /* green accent */
    border: none;
    padding: 12px;
    margin-bottom: 16px;
    font-size: 16px;
    text-align: left;
    width: 100%;
    transition: background-color 0.3s ease;
  }

  aside button.active {
    background: #4CAF50; /* solid green */
    color: white;
    font-weight: bold;
    border-radius: 6px;
  }

  main {
    flex: 1;
    margin-left: 300px;
    padding: 50px 40px;
    background: #FFFFFF;
    height: calc(100vh - 70px);
    overflow-y: auto;
  }

 .form-box-enrolledStudent {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  .form-box{
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    width: 50%;
    max-width: 800px;
    margin: 0 auto;
  }

  .form-title {
    font-size: 24px;
    font-weight: bold;
    color: #F44336; /* red title */
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
  }

  .input-field:focus {
    outline: none;
    border-color: #4CAF50; /* green border on focus */
  }

  .submit-button {
    background: #4CAF50; /* green */
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
    color: #F44336; /* red */
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
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 280px;
    transition: transform 0.2s;
    text-align: center;
  }

  .student-card:hover {
    transform: translateY(-5px);
  }

  .student-card h4 {
    margin-top: 0;
    font-size: 18px;
    color: #212121;
  }

  .student-card p {
    margin: 6px 0;
    font-size: 14px;
    color: #555;
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
  }

  .student-table th {
    background-color: #4CAF50; /* solid green header */
    color: #ffffff;
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .pagination button {
    background: #F44336; /* solid red */
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

.student-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .student-table th, .student-table td {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
        }

        .student-table th {
          background-color: #4CAF50;
          color: #ffffff;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }

        .pagination button {
          background: #F44336;
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
