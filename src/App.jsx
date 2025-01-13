import { useEffect, useState } from 'react';
import AttendanceForm from './components/AttendanceForm';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the current path includes '/admin'
    const checkPath = () => {
      const path = window.location.pathname;
      setIsAdmin(path.includes('/admin'));
    };

    // Initial check
    checkPath();

    // Listen for path changes
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  return (
    <div className="app-container">
      {isAdmin ? <AdminDashboard /> : <AttendanceForm />}
    </div>
  );
}

export default App; 