import { useEffect, useState } from 'react';
import AttendanceForm from './components/AttendanceForm';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the current URL includes 'admin'
    const checkPath = () => {
      const currentUrl = window.location.href;
      const isAdminUrl = currentUrl.includes('admin');
      setIsAdmin(isAdminUrl);
    };

    // Initial check
    checkPath();

    // Check for URL changes
    const interval = setInterval(checkPath, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle admin navigation
  const handleAdminAccess = (e) => {
    e.preventDefault();
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/admin`;
  };

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <AttendanceForm onAdminClick={handleAdminAccess} />;
}

export default App; 