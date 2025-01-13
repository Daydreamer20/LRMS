import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import depedLogo from '../../assets/deped-logo.png';
import lrmsLogo from '../../assets/lrms-logo.png';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add authentication logic
    console.log('Login attempt:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-teal-500">
          <div className="text-2xl font-semibold text-gray-700 mb-8">
            Login
          </div>

          <div className="flex justify-center space-x-8 mb-8">
            <img src={depedLogo} alt="DepEd Logo" className="h-16" />
            <img src={lrmsLogo} alt="LRMS Logo" className="h-16" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Username:
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="Username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Password:
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition duration-200"
            >
              Login
            </button>

            <div className="text-center text-sm text-gray-500">
              Oops You are Log out.
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link to="/register" className="text-teal-500 hover:text-teal-600">
              Don't have an account? Register here
            </Link>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            © 2024 - All Rights Reserved
            <div>BLR - Quality Assurance Division</div>
            <div>Evaluation Management System</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 