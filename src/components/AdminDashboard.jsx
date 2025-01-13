import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  // Mock data - replace with actual API calls
  const mockSubmissions = [
    {
      id: 1,
      fullName: 'John Doe',
      regionDivision: 'Region IV-A',
      designation: 'Teacher III',
      evaluationArea: '1',
      gradeLevel: '5',
      contactNumber: '09123456789',
      depedEmail: 'john.doe@deped.gov.ph',
      submittedAt: '2024-03-15'
    }
  ];

  useEffect(() => {
    // Get submissions from localStorage
    const storedSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    setSubmissions(storedSubmissions);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">LRE Registration Submissions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Full Name</th>
              <th className="px-4 py-2 border">Region/Division</th>
              <th className="px-4 py-2 border">Designation</th>
              <th className="px-4 py-2 border">Area</th>
              <th className="px-4 py-2 border">Grade</th>
              <th className="px-4 py-2 border">Contact</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td className="px-4 py-2 border">{submission.fullName}</td>
                <td className="px-4 py-2 border">{submission.regionDivision}</td>
                <td className="px-4 py-2 border">{submission.designation}</td>
                <td className="px-4 py-2 border">Area {submission.evaluationArea}</td>
                <td className="px-4 py-2 border">Grade {submission.gradeLevel}</td>
                <td className="px-4 py-2 border">{submission.contactNumber}</td>
                <td className="px-4 py-2 border">{submission.depedEmail}</td>
                <td className="px-4 py-2 border">{submission.submittedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard; 