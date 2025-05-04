import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// If credential matches, then student redirect here.
// Student Dashboard
export function Dashboard() {
  // Hooks
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingIds, setEnrollingIds] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const location = useLocation();
  const studentEmail = location.state?.userEmail || "";

  useEffect(() => {
    console.log("Email used in fetchCourses:", studentEmail);
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
        alert('Successfully enrolled in course!');
        fetchCourses(); 
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error during enrollment:', error);
    } finally {
      // No matter error happens or not, this statement execute
      setEnrollingIds(prev => prev.filter(id => id !== courseId));
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      const res = await fetch('http://localhost:8088/api/courses/unenroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: studentEmail, courseId })
      });
      if (res.ok) {
        alert('Successfully unenrolled!');
        fetchCourses();  
      } else {
        alert('Failed to unenroll');
      }
    } catch (error) {
      console.error('Error during unenrollment:', error);
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
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="layout">
      {/* Student Sidebar */}
        <aside>
          <h2>Dashboard</h2>
          <button onClick={() => setActiveTab('available')} className={activeTab === 'available' ? 'active' : ''}>Available Courses</button>
          <button onClick={() => setActiveTab('enrolled')} className={activeTab === 'enrolled' ? 'active' : ''}>My Enrolled Courses</button>
        </aside>

        <main>
          {loading ? (
            <div className="loading-indicator">Loading...</div>
          ) : activeTab === 'available' ? (
            <>
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
                      <div key={course.id} className={`course-card ${isFull ? 'full' : isEnrolled ? 'enrolled' : 'available'}`}>
                        <h3>{course.name}</h3>
                        <p><strong>Duration:</strong> {course.duration}</p>
                        <p><strong>Total Slots:</strong> {course.totalSlots}</p>
                        <p><strong>Remaining:</strong> {course.totalSlots - course.filledSlots}</p>
                        {isFull ? (
                          <span>Course Full</span>
                        ) : isEnrolled ? (
                          <button disabled>Enrolled</button>
                        ) : (
                          <button onClick={() => handleEnroll(course.id)} disabled={isEnrolling}>
                            {isEnrolling ? 'Enrolling...' : 'Enroll'}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <>
              <h2>My Enrolled Courses</h2>
              <div className="enrolled-grid">
                {enrolledCourses.length === 0 ? (
                  <p>You are not enrolled in any courses.</p>
                ) : (
                  enrolledCourses.map(course => (
                    <div key={course.id} className="enrolled-card">
                      <span>{course.name}</span>
                      <button onClick={() => handleUnenroll(course.id)}>Unenroll</button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>

    <style>{`
  body {
    font-family: 'Inter', sans-serif;
    background-color: #F0FAFF; /* light blue background from Add Course */
    margin: 0;
    padding: 0;
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
    background-color: #2196F3; /* solid blue from Add Course */
    color: white;
    padding: 0 20px;
    font-size: 18px;
    z-index: 1000;
  }

  button {
    background-color: #F44336; /* solid red from Add Course */
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #D32F2F; /* darker red for hover */
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
    background: #DFF6FF; /* light blue from Add Course */
    color: #1A1A1A;
    padding: 30px 20px;
    height: calc(100vh - 70px);
    z-index: 999;
  }

  aside button {
    background: transparent;
    color: #4CAF50; /* green accent from Add Course */
    border: none;
    padding: 12px;
    margin-bottom: 16px;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  aside button.active {
    background-color: #4CAF50; /* solid green from Add Course */
    color: white;
    font-weight: bold;
    border-radius: 6px;
  }

  main {
    flex: 1;
    margin-left: 300px;
    padding: 50px 40px;
    background: #FFFFFF; /* white background for main content */
    height: calc(100vh - 70px);
    overflow-y: auto;
  }

  .course-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .course-card {
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .course-card:hover {
    transform: translateY(-5px);
  }

  .course-card.full {
    background-color: #fef2f2;
    border: 1px solid #fca5a5;
    color: #b91c1c;
  }

  .course-card.enrolled {
    background-color: #ecfdf5;
    border: 1px solid #6ee7b7;
    color: #065f46;
  }

  .course-card.available {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    color: #1f2937;
  }

  .course-card.full button,
  .course-card.enrolled button {
    background-color: #d1d5db;
    color: #6b7280;
    cursor: not-allowed;
  }

  .enrolled-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .enrolled-card {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  button[disabled] {
    background-color: #A2A2A2;
    cursor: not-allowed;
  }

  .loading-indicator {
    text-align: center;
    font-size: 20px;
    color: #2196F3;
  }
`}</style>
    </>
  );
}
