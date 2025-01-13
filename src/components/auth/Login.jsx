import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import depedLogo from '../../assets/deped-logo.svg';
import lrmsLogo from '../../assets/lrms-logo.svg';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Admin credentials
  const ADMIN_USERNAME = 'admin@deped.gov.ph';
  const ADMIN_PASSWORD = 'BLR@QAD2024';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if admin login
    if (formData.username === ADMIN_USERNAME && formData.password === ADMIN_PASSWORD) {
      // TODO: Set admin authentication state
      navigate('/admin');
      return;
    }

    // TODO: Add regular user authentication logic
    setError('Invalid username or password');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-800">
          <div className="text-2xl font-semibold text-gray-700 mb-8 text-center">
            Welcome to LRMS
          </div>

          <div className="flex justify-center space-x-8 mb-8">
            <img src={depedLogo} alt="DepEd Logo" className="h-20" />
            <img src={lrmsLogo} alt="LRMS Logo" className="h-20" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address:
              </label>
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password:
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition duration-200"
            >
              Sign In
            </button>

            <div className="text-center text-sm text-gray-500">
              {formData.username && !formData.username.endsWith('@deped.gov.ph') && (
                <div className="text-yellow-600">
                  Please use your DepEd email (@deped.gov.ph)
                </div>
              )}
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link to="/register" className="text-blue-800 hover:text-blue-900">
              Don't have an account? Register here
            </Link>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            © 2024 - All Rights Reserved
            <div>BLR - Quality Assurance Division</div>
            <div>Learning Resource Management System</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 