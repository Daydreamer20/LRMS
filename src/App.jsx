import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AttendanceForm from './components/AttendanceForm';
import AdminDashboard from './components/AdminDashboard';

function App() {
  // Get the current path
  const path = window.location.pathname;

  // If we're on the admin path, render the AdminDashboard
  if (path.includes('/admin')) {
    return <AdminDashboard />;
  }

  // Otherwise render the AttendanceForm
  return <AttendanceForm />;
}

export default App; 