import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import depedLogo from '../../assets/deped-logo.svg';
import lrmsLogo from '../../assets/lrms-logo.svg';

function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    region: '',
    division: '',
    designation: '',
    preferredArea: '1',
    preferredGradeLevel: '5',
    contactNumber: '',
    depedEmail: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return email.toLowerCase().endsWith('@deped.gov.ph');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate required fields
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      }
    });

    // Validate DepEd email
    if (formData.depedEmail && !validateEmail(formData.depedEmail)) {
      newErrors.depedEmail = 'Must be a valid DepEd email (@deped.gov.ph)';
    }

    // Validate contact number
    if (formData.contactNumber && !/^\d{11}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Must be a valid 11-digit phone number';
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // TODO: Add API call to register user
      console.log('Registration data:', formData);
      navigate('/registration-success');
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-teal-500">
          <div className="text-2xl font-semibold text-gray-700 mb-8 text-center">
            Register for LRMS
          </div>

          <div className="flex justify-center space-x-8 mb-8">
            <img src={depedLogo} alt="DepEd Logo" className="h-16" />
            <img src={lrmsLogo} alt="LRMS Logo" className="h-16" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Region</label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    required
                  />
                  {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Division</label>
                  <input
                    type="text"
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    required
                  />
                  {errors.division && <p className="text-red-500 text-xs mt-1">{errors.division}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
                {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Area</label>
                  <select
                    name="preferredArea"
                    value={formData.preferredArea}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    required
                  >
                    <option value="1">Area 1: Curriculum</option>
                    <option value="3">Area 3: Instructional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade Level</label>
                  <select
                    name="preferredGradeLevel"
                    value={formData.preferredGradeLevel}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                    required
                  >
                    <option value="5">Grade 5</option>
                    <option value="8">Grade 8</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
                {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">DepEd Email</label>
                <input
                  type="email"
                  name="depedEmail"
                  value={formData.depedEmail}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
                {errors.depedEmail && <p className="text-red-500 text-xs mt-1">{errors.depedEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {errors.submit && <p className="text-red-500 text-sm text-center mt-4">{errors.submit}</p>}

            <div className="flex items-center justify-between mt-6">
              <Link
                to="/login"
                className="text-sm text-teal-500 hover:text-teal-600"
              >
                Already have an account? Login
              </Link>
              <button
                type="submit"
                className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition duration-200"
              >
                Register
              </button>
            </div>
          </form>

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

export default Registration; 