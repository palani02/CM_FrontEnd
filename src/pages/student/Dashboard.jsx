import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

export function Dashboard() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingIds, setEnrollingIds] = useState([]);
  const [unenrollingIds, setUnenrollingIds] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [toast, setToast] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
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

      fetchAnalyticsData(availableData, enrolledData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = (availableData, enrolledData) => {
    if (!availableData || !enrolledData) return;

    const totalAvailable = availableData.length;
    const totalEnrolled = enrolledData.length;

    const pieChartData = {
      labels: ['Enrolled', 'Available'],
      datasets: [
        {
          data: [totalEnrolled, totalAvailable - totalEnrolled],
          backgroundColor: ['#3c82f6', '#2d3748'],
          hoverOffset: 4,
        },
      ],
    };

    setAnalyticsData({ pieChartData });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
        showToast('Successfully unenrolled from course!');
        fetchCourses();
      } else {
        const errorData = await res.json();
        showToast(errorData.message || 'Failed to unenroll', 'error');
      }
    } catch (error) {
      console.error('Error during unenrollment:', error);
      showToast('An error occurred during unenrollment. Please try again.', 'error');
    } finally {
      setUnenrollingIds(prev => prev.filter(id => id !== courseId));
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
          <button onClick={() => setActiveTab('available')} className={activeTab === 'available' ? 'active' : ''}>
            Available Courses
          </button>
          <button onClick={() => setActiveTab('enrolled')} className={activeTab === 'enrolled' ? 'active' : ''}>
            My Enrolled Courses
          </button>
          <button onClick={() => setActiveTab('analytics')} className={activeTab === 'analytics' ? 'active' : ''}>
            Analytics
          </button>
        </aside>

        <main>
          {loading ? (
            <div className="loading-indicator">Loading...</div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'available' && (
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
              )}

              {activeTab === 'enrolled' && (
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
                            disabled={unenrollingIds.includes(course.id)}
                          >
                            {unenrollingIds.includes(course.id) ? 'Request Sent' : 'Unenroll'}
                          </motion.button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && analyticsData && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2>Analytics</h2>
                  <div className="analytics-charts">
                    <div style={{ width: '50%', margin: '0 auto' }}>
                      <Pie data={analyticsData.pieChartData} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>
      })
      <style>{`
    /* Root theme variables for maintainability */
:root {
  --primary: #3c82f6; /* Light Blue */
  --accent: #63b3ed;  /* Softer Blue for accent */
  --bg-dark: #000000;  /* Pure Black Background */
  --bg-card: rgba(255, 255, 255, 0.1); /* Semi-transparent background for cards */
  --glass-blur: blur(15px); /* Glassmorphism Effect */
  --font-main: 'Satoshi', 'Inter', 'Segoe UI', sans-serif; /* Clean sans-serif fonts */
  --text-light: #e2e8f0; /* Light Text Color */
  --text-accent: #3c82f6; /* Light Blue Accent Text Color */
  --shadow-deep: 0 10px 30px rgba(0, 0, 0, 0.2); /* Deep Shadow for Cards */
  --shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.1); /* Soft Shadow for UI Elements */
  --border-radius: 10px; /* Consistent border radius for smooth corners */
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-main);
  background-color: var(--bg-dark);
  color: var(--text-light);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Disabled button */
button:disabled {
  background-color: #333;
  cursor: not-allowed;
  opacity: 0.5;
}

/* Header */
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.85); /* Dark Background */
  backdrop-filter: var(--glass-blur);
  padding: 0 30px;
  z-index: 1000;
  box-shadow: var(--shadow-soft);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.top-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.student-name-header {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-accent);
}

/* Buttons */
button {
  padding: 12px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-deep);
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 30px rgba(60, 130, 246, 0.35); /* Lighter blue shadow effect */
}

/* Layout */
.layout {
  display: flex;
  min-height: 100vh;
  padding-top: 70px;
}

/* Sidebar */
aside {
  width: 260px;
  background: rgba(31, 41, 55, 0.95); /* Dark Gray with slight transparency */
  color: var(--text-light);
  padding: 30px 20px;
  position: fixed;
  top: 70px;
  left: 0;
  height: calc(100vh - 70px);
  backdrop-filter: var(--glass-blur);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

aside button {
  display: block;
  background: transparent;
  color: var(--primary); /* Light Blue */
  border: none;
  padding: 14px 12px;
  margin-bottom: 18px;
  width: 100%;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

aside button.active,
aside button:hover {
  background-color: var(--primary); /* Light Blue */
  color: #1a202c; /* Darker text for better contrast */
  font-weight: bold;
}

/* Main content */
main {
  flex: 1;
  margin-left: 260px;
  padding: 60px 40px;
  background: #111; /* Darker background for content */
  min-height: calc(100vh - 70px);
  overflow-y: auto;
}

/* Course Grid */
.course-grid,
.enrolled-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

/* Course Cards */
.course-card,
.enrolled-card {
  background: var(--bg-card);
  padding: 24px;
  border-radius: 16px;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 14px;
  backdrop-filter: var(--glass-blur);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.course-card:hover,
.enrolled-card:hover {
  transform: translateY(-6px); /* Stronger hover effect */
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15); /* Deeper shadow */
}

/* Full and Enrolled States */
.course-card.full {
  background-color: #333; /* Dark Gray for Full Courses */
  color: #f9fafb; /* Light text */
  border: 1px solid #2d3748;
}

.course-card.enrolled {
  background-color: #2d3748; /* Slightly lighter dark background for enrolled */
  color: var(--text-light);
  border: 1px solid var(--primary); /* Light Blue border for enrolled courses */
}

.enrolled-card {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

/* Loading Indicator */
.loading-indicator {
  color: var(--primary); /* Light Blue */
  font-size: 18px;
  text-align: center;
  margin-top: 30px;
}
 .analytics-charts {
          display: flex;
          gap: 20px;
          margin-top: 30px;
        }
/* Toasts */
.toast {
  position: fixed;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  z-index: 2000;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--shadow-soft);
  animation: fadeInOut 3s ease forwards;
}

.toast.success {
  background-color: #22c55e; /* Green success toast */
}

.toast.error {
  background-color: #ef4444; /* Red error toast */
}

/* Animation */
@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}


      `}</style>
    </>
  );
}
