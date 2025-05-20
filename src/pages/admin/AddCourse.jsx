import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminUnenrollRequests from "./AdminUnenrollRequests";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

import { AreaChart, Area } from 'recharts';
export function AddCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    duration: "",
    session: "",
    totalSlots: "",
    filledSlots: ""
  });
  const [view, setView] = useState("dashboard");
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [analytics, setAnalytics] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalSessions: 0,
    availableSlots: 0,
  });

  useEffect(() => {
    if (view === "students" || view === "remove-student") {
      axios.get("http://localhost:8088/api/courses/enrollments-list-all")
        .then((res) => setEnrolledStudents(res.data))
        .catch((err) => console.error("Error fetching students:", err));
    }
    if (view === "remove" || view === "students" || view === "remove-student" || view === "dashboard") {
      axios.get("http://localhost:8088/api/courses/available")
        .then((res) => {
          setAvailableCourses(res.data);

          if (view === "dashboard") {
            const totalCourses = res.data.length;
            let totalSessions = 0;
            let totalSlots = 0;
            let totalFilledSlots = 0;
            res.data.forEach(course => {
              totalSessions += course.session ? 1 : 0;
              totalSlots += course.totalSlots || 0;
              totalFilledSlots += course.filledSlots || 0;
            });

            setAnalytics({
              totalCourses,
              totalStudents: totalFilledSlots,
              totalSessions,
              availableSlots: totalSlots - totalFilledSlots,
            });
          }
        })
        .catch((err) => console.error("Error fetching courses:", err));
    }
  }, [view]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourseId) {
        await axios.put(`http://localhost:8088/api/courses/update-course?courseId=${editingCourseId}`, {
          ...form,
          totalSlots: parseInt(form.totalSlots),
          filledSlots: parseInt(form.filledSlots)
        });
        alert("Course updated!");
      } else {
        await axios.post("http://localhost:8088/api/courses", {
          ...form,
          totalSlots: parseInt(form.totalSlots),
          filledSlots: parseInt(form.filledSlots)
        });
        alert("Course added!");
      }

      setForm({ name: "", duration: "", session: "", totalSlots: "", filledSlots: "" });
      setEditingCourseId(null);
      setView("dashboard");
    } catch (err) {
      console.error(err);
      alert("Error submitting course");
    }
  };

  const handleEdit = (courseId) => {
    const course = availableCourses.find((c) => c.id === courseId);
    if (course) {
      setForm({
        name: course.name,
        duration: course.duration,
        session: course.session,
        totalSlots: course.totalSlots.toString(),
        filledSlots: course.filledSlots.toString(),
      });
      setEditingCourseId(courseId);
      setView("course");
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
          <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>Analytics</button>
          <button className={view === "course" ? "active" : ""} onClick={() => setView("course")}>Add New Course</button>
          <button className={view === "students" ? "active" : ""} onClick={() => setView("students")}>Enrolled Students</button>
          <button className={view === "remove" ? "active" : ""} onClick={() => setView("remove")}>Remove / Update</button>
          <button className={view === "remove-student" ? "active" : ""} onClick={() => setView("remove-student")}>Remove Student</button>
          <button className={view === "unenroll-requests" ? "active" : ""} onClick={() => setView("unenroll-requests")}>
  Unenroll Requests 
  {pendingCount > 0 && <span className="notification-count">{pendingCount}</span>}
</button>
        </aside>

 {/* Here is my Main Analytics Section starts */}
       <main style={{ backgroundColor: '#121212', color: '#E0E0E0', minHeight: '100vh', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
  {view === "dashboard" && (
    <div className="analytics-container" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h2 
        className="dashboard-title" 
        style={{ 
          fontSize: '2rem', 
          fontWeight: '800', 
          marginBottom: '2rem', 
          color: '#FFFFFF', 
          textShadow: '0 1px 3px rgba(0,0,0,0.7)'
        }}
      >
        📊 Advanced Analytics
      </h2>

      <div 
        className="analytics-cards" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '3rem' 
        }}
      >
        {[
          { label: "Total Courses", value: analytics.totalCourses },
          { label: "Total Students Enrolled", value: analytics.totalStudents },
          { label: "Total Sessions", value: analytics.totalSessions },
          { label: "Available Slots", value: analytics.availableSlots },
        ].map((item, i) => (
          <div 
            key={i} 
            className="card" 
            style={{ 
              backgroundColor: '#1E1E2F', 
              borderRadius: '1rem', 
              padding: '1.5rem', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.8)', 
              color: '#E0E0E0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'background-color 0.3s ease',
              cursor: 'default',
              userSelect: 'none',
              fontWeight: '600'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#292946'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1E1E2F'}
          >
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#9CA3AF' }}>{item.label}</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: '800', color: '#FFFFFF' }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Container with dark background */}
     <div
  className="chart-container"
  style={{
    backgroundColor: '#12162C', // Darker base for elegance
    padding: '3rem 4rem', // More spacious padding for sophistication
    borderRadius: '2rem',
    boxShadow: '0 12px 50px rgba(0, 0, 0, 0.7)', // Stronger shadow to pop out more
    marginBottom: '4rem',
    position: 'relative',
    overflow: 'hidden',
  }}
>
  <h3
    style={{
      fontSize: '2.6rem',
      fontWeight: '900',
      marginBottom: '2.5rem',
      color: '#A5B4FC', // Softer blue for a professional, calm effect
      textShadow: '0 3px 10px rgba(96, 165, 250, 0.8)',
      fontFamily: 'Inter, sans-serif', // Premium font
      letterSpacing: '1px',
      lineHeight: '1.4',
    }}
  >
    Course vs Filled Slots
  </h3>

  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={availableCourses.map((course) => ({
        name: course.name.length > 10 ? `${course.name.slice(0, 15)}` : course.name,
        Filled: course.filledSlots,
        Available: course.totalSlots - course.filledSlots,
      }))}
      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
      barCategoryGap="20%"
    >
      {/* Removed visible grid lines */}
      <CartesianGrid stroke="none" />

      {/* X-Axis with improved styling */}
      <XAxis
        dataKey="name"
        tick={{ fill: '#A5B4FC', fontWeight: '500', fontSize: 14, letterSpacing: '0.5px' }}
        tickLine={false}
        axisLine={{ stroke: '#4B5563' }}
        interval={0}
        angle={-40}
        textAnchor="end"
        height={60}
      />

      {/* Y-Axis with refined design */}
      <YAxis
        tick={{ fill: '#A5B4FC', fontWeight: '500', fontSize: 14 }}
        axisLine={{ stroke: '#4B5563' }}
        tickLine={false}
        allowDecimals={false}
      />

      {/* Enhanced Tooltip */}
      <Tooltip
        contentStyle={{
          backgroundColor: '#1E2130', // Darker background for premium feel
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)',
          border: 'none',
          fontSize: '16px',
          padding: '18px 28px',
          color: '#E4E4E7',
          fontFamily: 'Inter, sans-serif',
        }}
        cursor={{ fill: 'rgba(96, 165, 250, 0.1)' }}
      />

      {/* Legend Styling */}
      <Legend
        verticalAlign="top"
        height={40}
        wrapperStyle={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#A5B4FC',
          marginBottom: 10,
          fontFamily: 'Inter, sans-serif',
        }}
        iconType="circle"
        formatter={(value) => (
          <span style={{ color: value === 'Filled' ? '#3B82F6' : '#10B981' }}>{value}</span>
        )}
      />

      {/* Bars with smoother gradients and rounded edges */}
      <Bar
        dataKey="Filled"
        fill="url(#filledGradient)"
        radius={[10, 10, 0, 0]}
        barSize={36}
        maxBarSize={50}
      />
      <Bar
        dataKey="Available"
        fill="url(#availableGradient)"
        radius={[10, 10, 0, 0]}
        barSize={36}
        maxBarSize={50}
      />

      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="filledGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.7} />
        </linearGradient>
        <linearGradient id="availableGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#34D399" stopOpacity={0.7} />
        </linearGradient>
      </defs>
    </BarChart>
  </ResponsiveContainer>

  {/* Background gradient effect for premium feel */}
  <div
    style={{
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, rgba(56, 134, 222, 0.3), rgba(64, 199, 163, 0.2))',
      opacity: '0.4',
      zIndex: '-1',
      borderRadius: '2rem',
    }}
  />
</div>

      {/* Pie Chart Container */}
    <div 
  className="chart-container" 
  style={{ 
    backgroundColor: '#14162C', // Darker background for more contrast
    padding: '2.5rem 3rem', // More padding for spacious feel
    borderRadius: '1.5rem', 
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.65)', // Deeper shadow for sophistication
    marginBottom: '3.5rem',
    color: '#FFFFFF', // Global white font for high contrast
    position: 'relative',
    overflow: 'hidden',
  }}
>
  <h3 
    style={{ 
      fontSize: '2.6rem', 
      fontWeight: '1000', 
      marginBottom: '2rem', 
      color: '#A5B4FC',  // Soft bluish tone to match modern SaaS aesthetics
       textShadow: '0 3px 10px rgba(96, 165, 250, 0.8)', // Subtle text shadow for depth
      letterSpacing: '1px',
    }}
  >
    Enrollment Distribution
  </h3>

  <ResponsiveContainer width="100%" height={500}>
    <PieChart>
      <Pie
        data={availableCourses.map(course => ({
          name: course.name,
          value: course.filledSlots,
        }))}
        cx="50%"
        cy="50%"
        innerRadius={90}
        outerRadius={150}
        paddingAngle={5}
        dataKey="value"
        isAnimationActive={true}
        labelLine={false}
        label={false}
      >
        {availableCourses.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#60A5FA"][index % 6]}
          />
        ))}
      </Pie>

      {/* Tooltip Styling */}
      <Tooltip
        contentStyle={{
          backgroundColor: "#1E2130", // Darker, more subtle background
          border: "1px solid #4B5563",
          borderRadius: "12px",
          fontSize: "15px",
          padding: "15px 20px",
          color: "#E4E4E7", // Slightly off-white text color
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.5)", // Subtle shadow for realism
        }}
        itemStyle={{
          color: "#A5B4FC", // Light blue for text inside tooltip
          fontWeight: '500',
        }}
      />
      
      {/* Enhanced Legend Styling */}
      <Legend
        verticalAlign="bottom"
        height={36}
        iconType="circle"
        wrapperStyle={{ 
          fontSize: '15px', 
          marginTop: '25px', 
          color: '#A5B4FC', // Light blue color for contrast
          letterSpacing: '0.5px',
          fontWeight: '600',
        }}
      />
    </PieChart>
  </ResponsiveContainer>

  {/* Modern Gradient Background Effect */}
  <div 
    style={{
      position: 'absolute', 
      top: '0', 
      left: '0', 
      width: '100%', 
      height: '100%', 
      background: 'linear-gradient(135deg, rgba(56, 134, 222, 0.3), rgba(64, 199, 163, 0.2))', 
      opacity: '0.5', 
      zIndex: '-1', 
      borderRadius: '1.5rem', 
    }} 
  />
</div>

{/* Wave Chart*/}

<div className="p-10 bg-gradient-to-r from-gray-800 via-indigo-900 to-purple-800 rounded-3xl shadow-2xl flex justify-center items-center">
  <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-700 shadow-xl font-inter transform transition-all duration-300 hover:scale-105 w-full max-w-4xl">
    <h2 className="text-2xl font-semibold text-white tracking-tight mb-3">
      Course Slot Overview
    </h2>
    <p className="text-sm text-gray-300 mb-6 leading-relaxed">
      Real-time insights on course capacity – total vs. filled slots across all offerings.
    </p>

    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={availableCourses.map(course => ({
          name: course.name,
          total: course.totalSlots,
          filled: course.filledSlots
        }))}
        margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorFilled" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E5E7EB" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#E5E7EB" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="2 2"
          stroke="rgba(255, 255, 255, 0.1)"
          vertical={false}
        />

        <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#F9FAFB" }} />
        <YAxis tick={{ fontSize: 13, fill: "#F9FAFB" }} />

        <Tooltip
          contentStyle={{ backgroundColor: "#111827", borderRadius: 10, border: "none", padding: 12 }}
          labelStyle={{ color: "#D1D5DB", fontSize: 13 }}
          itemStyle={{ color: "#F9FAFB", fontSize: 13 }}
          cursor={{ stroke: "#9CA3AF", strokeWidth: 1, strokeDasharray: "3 3" }}
        />

        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          wrapperStyle={{ top: -25, right: 20, fontSize: 13, color: "#F9FAFB" }}
        />

        <Area
          type="monotone"
          dataKey="total"
          name="Total Slots"
          stroke="#D1D5DB"
          fillOpacity={1}
          fill="url(#colorTotal)"
          strokeDasharray="4 4"
          isAnimationActive={true}
        />
        <Area
          type="monotone"
          dataKey="filled"
          name="Filled Slots"
          stroke="#2563EB"
          fillOpacity={1}
          fill="url(#colorFilled)"
          strokeWidth={2}
          isAnimationActive={true}
          dot={{ r: 4, stroke: "#1D4ED8", strokeWidth: 2, fill: "#fff" }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>

    </div>
  )}
 

          {view === "course" && (
            <div className="form-box">
              <h2 className="form-title">{editingCourseId ? "Update Course" : "Add New Course"}</h2>
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
                <button type="submit" className="submit-button">{editingCourseId ? "Update Course" : "Add Course"}</button>
              </form>
            </div>
          )}

          {view === "remove" && (
            <div className="form-box-enrolledStudent">
              <h2 className="form-title">Remove Courses</h2>
              {availableCourses.length ? (
              <ul className="course-list">
  {availableCourses.map(course => (
    <li key={course.id} className="course-item">
      <div className="course-info">
        <span className="course-name">{course.name} ({course.duration})</span>
      </div>
      <div 
  className="course-actions" 
  style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
>
  <button className="edit-btn" onClick={() => handleEdit(course.id)}>Edit</button>
  <button className="remove-btn" onClick={() => handleDelete(course.id)}>Delete</button>
</div>

    </li>
  ))}
</ul>

              ) : <p>No courses available to delete.</p>}
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

          {view === "remove-student" && (
            <div className="form-box-enrolledStudent">
              <h2 className="form-title">Remove Students</h2>
              {filteredStudents.length ? (
                <>
                  <div className="filter-container">
                    <label htmlFor="courseFilterRemove">Filter by Course:</label>
                    <select id="courseFilterRemove" onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
                      <option value="All">All Courses</option>
                      {availableCourses.map(course => (
                        <option key={course.id} value={course.name}>{course.name}</option>
                      ))}
                    </select>
                  </div>
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
                      {paginate(filteredStudents).map((student, index) => (
                        <tr key={index}>
                          <td>{student.studentEmail}</td>
                          <td>{student.courseName}</td>
                          <td>{student.session}</td>
                          <td>
                            <button className="remove-btn" onClick={() => handleStudentRemove(student.studentEmail)}>Remove</button>
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
            <AdminUnenrollRequests setPendingCount={setPendingCount} />
          )}
        </main>
      </div>
      <style>{`
     /* Reset & base */
* {
  box-sizing: border-box;
  font-family: 'Inter', 'Söhne', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body, html {
  margin: 0;
  padding: 0;
  background: #0f0f10;
  color: #e5e5e5;
  line-height: 1.5;
}

/* Header */
header {
  background: #1a1a1d;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  position: sticky;
  top: 0;
  z-index: 1000;
}
header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}
header button {
  background: #2a2a2d;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}
header button:hover {
  background: #444;
}

/* Layout */
.layout {
  display: flex;
  min-height: calc(100vh - 64px);
}
aside {
  width: 240px;
  background: #1a1a1d;
  padding: 24px;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
}
aside h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #60a5fa;
  margin-bottom: 16px;
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 6px;
}
aside button {
  background: transparent;
  border: none;
  text-align: left;
  padding: 12px 10px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: #ccc;
  transition: all 0.3s ease;
}
aside button.active,
aside button:hover {
  background: #3b82f6;
  color: white;
}

/* Main */
main {
  flex-grow: 1;
  padding: 28px;
  background: #121212;
  overflow-y: auto;
}

/* Cards & analytics */
.analytics-container h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 24px;
  color: #fff;
}
.analytics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}
.card {
  background: #1f1f22;
  border-radius: 12px;
  padding: 28px 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.notification-count {
  background-color: red;   
  color: white;           
  border-radius: 50%;      
  padding: 0.3em 0.7em;   
  font-weight: bold;      
  font-size: 1.0em;       
  position: absolute;     
  top: 7px;             
  right: 1px;           
}

/* Additional styling to make sure button has relative positioning */
button {
  position: relative;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
}
.card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ddd;
}
.card p {
  font-size: 2.4rem;
  font-weight: 800;
  color: #60a5fa;
  margin: 0;
}

/* Form styling */
.form-box,
.form-box-enrolledStudent {
  background: #1f1f22;
  padding: 28px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  max-width: 650px;
  margin: 0 auto;
}
.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #60a5fa;
  text-align: center;
  margin-bottom: 24px;
}
.form-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.input-field {
  padding: 14px 16px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #444;
  background: #121212;
  color: #e5e5e5;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.input-field:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
  outline: none;
}
.submit-button {
  background: #3b82f6;
  color: white;
  font-weight: 700;
  padding: 14px;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.submit-button:hover {
  background: #2563eb;
}

/* Table */
.student-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  font-size: 0.95rem;
}
.student-table th,
.student-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  text-align: left;
}
.student-table th {
  background: #3b82f6;
  color: white;
  font-weight: 600;
}

/* Pagination */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
.pagination button {
  background: #3b82f6;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}
.pagination button:disabled {
  background: #1e3a8a;
  cursor: not-allowed;
}
.pagination span {
  font-weight: 600;
  color: #e5e5e5;
}

/* Course list */
.course-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.course-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border-bottom: 1px solid #333;
  background: #1a1a1d;
}
.remove-btn,
.edit-btn {
  border: none;
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}
.remove-btn {
  background: #dc3545;
}
.remove-btn:hover {
  background: #a71d2a;
}
.edit-btn {
  background: #10b981;
  margin-left: 10px;
}
.edit-btn:hover {
  background: #059669;
}

/* Filters */
.filter-container {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.filter-container label {
  font-weight: 600;
  color: #60a5fa;
}
.filter-container select {
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #333;
  background: #121212;
  color: #e5e5e5;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
  aside {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 12px;
    gap: 8px;
  }
  main {
    padding: 20px;
  }
}

      `}</style>
    </>
  );
}

export default AddCourse;
