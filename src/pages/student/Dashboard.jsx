import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function Dashboard() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingIds, setEnrollingIds] = useState([]);
  const [unenrollingIds, setUnenrollingIds] = useState([]); // For tracking unenroll requests
  const [activeTab, setActiveTab] = useState('available');
  const [toast, setToast] = useState(null);
  const location = useLocation();
  const studentEmail = location.state?.userEmail || "";
  const studentName = studentEmail.split('@')[0];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const [availableRes, enrolledRes] = await Promise.all([
        fetch(`http://localhost:8088/api/courses/available?studentEmail=${studentEmail}`),
        fetch(`http://localhost:8088/api/courses/enrolled?studentEmail=${studentEmail}`)
      ]);

      const availableData = await availableRes.json();
      const enrolledData = await enrolledRes.json();

      setAvailableCourses(availableData);
      setEnrolledCourses(enrolledData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleEnroll = async (courseId) => {
    if (enrollingIds.includes(courseId)) return;
    setEnrollingIds(prev => [...prev, courseId]);
    try {
      const res = await fetch('http://localhost:8088/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: studentEmail, courseId })
      });
      if (res.ok) {
        showToast('Successfully enrolled in course!');
        fetchCourses();
      } else {
        const errorData = await res.json();
        showToast(errorData.message || 'Failed to enroll', 'error');
      }
    } catch (error) {
      console.error('Error during enrollment:', error);
      showToast('An error occurred during enrollment. Please try again.', 'error');
    } finally {
      setEnrollingIds(prev => prev.filter(id => id !== courseId));
    }
  };
const handleUnenroll = async (courseId) => {
  if (unenrollingIds.includes(courseId)) return;

  setUnenrollingIds(prev => [...prev, courseId]);

  try {
    const res = await fetch('http://localhost:8088/api/courses/unenroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: studentEmail, courseId })
    });

    if (res.ok) {
      showToast('Unenrollment request submitted successfully.');
      // Delay course refresh so the button stays "Request Sent" for a bit
      setTimeout(() => {
        // Ensuring we update unenrollingIds properly after the course list is refreshed
        fetchCourses();
        setUnenrollingIds(prev => prev.filter(id => id !== courseId));
      }, 2000); // 2 seconds delay before refreshing the courses
    } else {
      const errorData = await res.json();
      showToast(errorData.message || 'Failed to submit unenrollment request.', 'error');
    }
  } catch (error) {
    console.error('Error during unenrollment request:', error);
    showToast('An error occurred during unenrollment request. Please try again.', 'error');
  }
};




  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.location.href = "/";
  };

  return (
    <>
      <header>
        <h1>Student Dashboard</h1>
        <div className="top-right">
          <motion.span
            className="student-name-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome, <strong>{studentName}</strong>
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
          >
            Logout
          </motion.button>
        </div>
      </header>

      <div className="layout">
        <aside>
          <h2>Dashboard</h2>
          <button
            onClick={() => setActiveTab('available')}
            className={activeTab === 'available' ? 'active' : ''}
          >
            Available Courses
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={activeTab === 'enrolled' ? 'active' : ''}
          >
            My Enrolled Courses
          </button>
        </aside>

        <main>
          {loading ? (
            <div className="loading-indicator">Loading...</div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'available' ? (
                <motion.div
                  key="available"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2>Available Courses</h2>
                  <div className="course-grid">
                    {availableCourses.length === 0 ? (
                      <p>No courses available for you right now.</p>
                    ) : (
                      availableCourses.map(course => {
                        const isFull = course.filledSlots >= course.totalSlots;
                        const isEnrolled = enrolledCourses.some(c => c.id === course.id);
                        const isEnrolling = enrollingIds.includes(course.id);
                        return (
                          <div
                            key={course.id}
                            className={`course-card ${isFull ? 'full' : isEnrolled ? 'enrolled' : 'available'}`}
                          >
                            <h3>{course.name}</h3>
                            <p><strong>Duration:</strong> {course.duration}</p>
                            <p><strong>Total Slots:</strong> {course.totalSlots}</p>
                            <p><strong>Remaining:</strong> {course.totalSlots - course.filledSlots}</p>
                            {isFull ? (
                              <span>Course Full</span>
                            ) : isEnrolled ? (
                              <button disabled>Enrolled</button>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleEnroll(course.id)}
                                disabled={isEnrolling}
                              >
                                {isEnrolling ? 'Enrolling...' : 'Enroll'}
                              </motion.button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="enrolled"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2>My Enrolled Courses</h2>
                  <div className="enrolled-grid">
                    {enrolledCourses.length === 0 ? (
  <p>You are not enrolled in any courses.</p>
) : (
  enrolledCourses.map(course => (
    <div key={course.id} className="enrolled-card">
      <span>{course.name}</span>
      <motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  onClick={() => handleUnenroll(course.id)}
  disabled={unenrollingIds.includes(course.id)}  // Disable button during unenrollment
  style={{
    backgroundColor: unenrollingIds.includes(course.id) ? '#4CAF50' : '', // Green color for "Request Sent"
  }}
>
  {unenrollingIds.includes(course.id) ? 'Request Sent' : 'Unenroll'}
</motion.button>

    </div>
  ))
)}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <style>{`
      button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        body {
          font-family: 'Inter', sans-serif;
          background-color: #0f0f11;
          margin: 0;
          padding: 0;
          color: white;
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
          background-color: #2196F3;
          color: white;
          padding: 0 20px;
          font-size: 18px;
          z-index: 1000;
        }

        .top-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .student-name-header {
          font-size: 16px;
          color: #facc15;
        }

        button {
          padding: 10px 20px;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-weight: bold;
          background: linear-gradient(to right, #3b82f6, #06b6d4);
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
          background: #1e293b;
          color: white;
          padding: 30px 20px;
          height: calc(100vh - 70px);
        }

        aside button {
          background: transparent;
          color: #38bdf8;
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
          background: #1e293b;
          height: calc(100vh - 70px);
          overflow-y: auto;
        }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .course-card {
          background: #2e3b4e;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .course-card.full {
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
          color: #b91c1c;
        }

        .course-card.enrolled {
          background-color: #f5d0c5;
          border: 2px solid #f87171;
          color: #991b1b;
        }

        .enrolled-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .enrolled-card {
          background-color: #2e3b4e;
          color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .loading-indicator {
          color: #38bdf8;
          font-size: 18px;
          text-align: center;
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
      `}</style>
    </>
  );
}
