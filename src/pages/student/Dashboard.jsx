import { useEffect, useState } from 'react';

export function Dashboard() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingIds, setEnrollingIds] = useState([]);

  const studentEmail = "student@example.com"; // Replace with real email if needed

  useEffect(() => {
    fetchAvailableCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      const response = await fetch('http://localhost:8088/api/courses/available');
      const data = await response.json();
      setAvailableCourses(data);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch(`http://localhost:8088/api/courses/enrolled?studentEmail=${studentEmail}`);
      const data = await response.json();
      setEnrolledCourses(data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (enrollingIds.includes(courseId)) return; // Prevent multiple clicks

    setEnrollingIds((prev) => [...prev, courseId]);

    try {
      const response = await fetch('http://localhost:8088/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: studentEmail, courseId }),
      });

      if (response.ok) {
        alert('Successfully enrolled in course!');
        const enrolledCourse = availableCourses.find((c) => c.id === courseId);
        setEnrolledCourses((prev) => [...prev, enrolledCourse]);

        // Optionally update available courses to reflect slot change
        setAvailableCourses((prev) =>
          prev.map((course) =>
            course.id === courseId
              ? { ...course, filledSlots: course.filledSlots + 1 }
              : course
          )
        );
      } else {
        const result = await response.json();
        alert(result.message || 'Failed to enroll in the course');
      }
    } catch (error) {
      console.error('Error during enrollment:', error);
    } finally {
      setEnrollingIds((prev) => prev.filter((id) => id !== courseId));
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      const response = await fetch('http://localhost:8088/api/courses/unenroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: studentEmail, courseId }),
      });

      if (response.ok) {
        alert('Successfully unenrolled from course!');
        setEnrolledCourses((prev) => prev.filter((c) => c.id !== courseId));

        setAvailableCourses((prev) =>
          prev.map((course) =>
            course.id === courseId
              ? { ...course, filledSlots: course.filledSlots - 1 }
              : course
          )
        );
      } else {
        alert('Failed to unenroll from the course');
      }
    } catch (error) {
      console.error('Error during unenrollment:', error);
    }
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="top-bar">
          <div className="profile-section">
            <img src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png" alt="Profile" className="profile-image" />
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            <h2 className="section-title">Available Courses</h2>
            <div className="course-grid">
              {availableCourses.map((course) => {
                const isFull = course.filledSlots >= course.totalSlots;
                const isEnrolled = enrolledCourses.some((enrolled) => enrolled.id === course.id);
                const isEnrolling = enrollingIds.includes(course.id);

                return (
                  <div key={course.id} className="course-card">
                    <h3 className="course-name">{course.name}</h3>
                    <p><strong>Duration:</strong> {course.duration}</p>
                    <p><strong>Sessions:</strong> {course.session}</p>
                    <p><strong>Total Slots:</strong> {course.totalSlots}</p>
                    <p><strong>Filled:</strong> {course.filledSlots}</p>
                    <p><strong>Remaining:</strong> {course.totalSlots - course.filledSlots}</p>

                    {isFull ? (
                      <span className="course-status full">Course Full</span>
                    ) : isEnrolled ? (
                      <button className="enroll-button enrolled" disabled>Enrolled</button>
                    ) : (
                      <button
                        className="enroll-button"
                        onClick={() => handleEnroll(course.id)}
                        disabled={isEnrolling}
                      >
                        {isEnrolling ? 'Enrolling...' : 'Enroll'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <h2 className="section-title">My Enrolled Courses</h2>
            <div className="enrolled-list">
              {enrolledCourses.length === 0 ? (
                <p className="empty-message">You are not enrolled in any courses.</p>
              ) : (
                enrolledCourses.map((course) => (
                  <div key={course.id} className="enrolled-card">
                    <span>{course.name}</span>
                    <button
                      onClick={() => handleUnenroll(course.id)}
                      className="unenroll-button"
                    >
                      Unenroll
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    
      <style>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #f9fafb;
          padding: 40px 20px;
          font-family: 'Segoe UI', sans-serif;
          color: #333;
        }

        .top-bar {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 20px;
        }

        .profile-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .profile-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .logout-button {
          background-color: #6366f1;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .logout-button:hover {
          background-color: #4f46e5;
        }

        .section-title {
          font-size: 24px;
          font-weight: bold;
          color: #4f46e5;
          margin-bottom: 20px;
        }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .course-card {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .course-name {
          font-size: 18px;
          color: #2563eb;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .enroll-button {
          background-color: #10b981;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 12px;
          transition: background-color 0.3s ease;
        }

        .enroll-button:hover {
          background-color: #059669;
        }

        .enroll-button.enrolled {
          background-color: #cbd5e1;
          color: #1e293b;
          cursor: not-allowed;
        }

        .course-status.full {
          display: inline-block;
          padding: 8px 16px;
          margin-top: 12px;
          background-color: #f87171;
          color: white;
          border-radius: 6px;
          font-weight: 500;
        }

        .enrolled-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .enrolled-card {
          background-color: white;
          padding: 15px 20px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
        }

        .unenroll-button {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .unenroll-button:hover {
          background-color: #dc2626;
        }

        .empty-message {
          color: #666;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          font-size: 18px;
          color: #555;
        }

        @media (max-width: 600px) {
          .course-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            text-align: center;
          }

          .top-bar {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
