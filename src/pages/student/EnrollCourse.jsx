
export function EnrollCourse() {
  const availableCourses = ['Advanced CSS', 'GraphQL Basics'];
  return (
    <div className="p-8 bg-white min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Available Courses</h2>
      {availableCourses.map(course => (
        <div key={course} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow mb-4">
          <span>{course}</span>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
            Enroll
          </button>
        </div>
      ))}
    </div>
  );
}