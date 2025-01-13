import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AttendanceForm from './components/AttendanceForm';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AttendanceForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App; 