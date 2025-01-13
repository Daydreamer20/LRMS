import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EventsList from './components/events/EventsList';
import AdminLayout from './components/admin/AdminLayout';
import EventManagement from './components/admin/EventManagement';
import ParticipantManagement from './components/admin/ParticipantManagement';
import RatingManagement from './components/admin/RatingManagement';
import Registration from './components/auth/Registration';
import RegistrationSuccess from './components/auth/RegistrationSuccess';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Learning Resource Management System
                </h1>
              </div>
            </header>
            <main>
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <Link
                    to="/register"
                    className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                  >
                    Register Now
                  </Link>
                </div>
                <EventsList />
              </div>
            </main>
          </div>
        } />

        {/* Auth Routes */}
        <Route path="/register" element={<Registration />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<EventManagement />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="participants" element={<ParticipantManagement />} />
          <Route path="ratings" element={<RatingManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 