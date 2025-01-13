import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EventsList from './components/events/EventsList';
import AdminLayout from './components/admin/AdminLayout';
import EventManagement from './components/admin/EventManagement';
import ParticipantManagement from './components/admin/ParticipantManagement';
import RatingManagement from './components/admin/RatingManagement';
import Registration from './components/auth/Registration';
import RegistrationSuccess from './components/auth/RegistrationSuccess';
import Login from './components/auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
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
                <EventsList />
              </div>
            </main>
          </div>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<EventManagement />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="participants" element={<ParticipantManagement />} />
          <Route path="ratings" element={<RatingManagement />} />
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 