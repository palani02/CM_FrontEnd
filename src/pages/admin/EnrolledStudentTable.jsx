
export function EnrolledStudentTable() {
  const students = [
    { name: 'Alice', course: 'React Basics' },
    { name: 'Bob', course: 'Node.js Mastery' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-teal-600 mb-6">Enrolled Students</h2>
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200 text-gray-600">
          <tr>
            <th className="p-4 text-left">Student Name</th>
            <th className="p-4 text-left">Course</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => (
            <tr key={index} className="border-t hover:bg-gray-100">
              <td className="p-4">{s.name}</td>
              <td className="p-4">{s.course}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
