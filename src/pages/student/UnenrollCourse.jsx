
export function UnenrollCourse() {
  const enrolledCourses = ['React Basics', 'Node.js Mastery'];
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-red-600 mb-6">Unenroll from Courses</h2>
      {enrolledCourses.map(course => (
        <div key={course} className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-4">
          <span>{course}</span>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Unenroll
          </button>
        </div>
      ))}
    </div>
  );
}
