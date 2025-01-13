import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    depedEmail: ''
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

    // Validate contact number (simple validation)
    if (formData.contactNumber && !/^\d{11}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Must be a valid 11-digit phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: Add API call to register user
    try {
      // Simulate API call
      console.log('Registration data:', formData);
      // Redirect to success page or login
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl text-gray-700">
                <h2 className="leading-relaxed">Register for LRMS</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  Please fill in your information to create an account
                </p>
              </div>
            </div>
            <form className="divide-y divide-gray-200" onSubmit={handleSubmit}>
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose">Region</label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none"
                    placeholder="Enter your region"
                  />
                  {errors.region && <p className="text-red-500 text-sm">{errors.region}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose">Division</label>
                  <input
                    type="text"
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none"
                    placeholder="Enter your division"
                  />
                  {errors.division && <p className="text-red-500 text-sm">{errors.division}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none"
                    placeholder="Enter your designation"
                  />
                  {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose">Preferred Area of Evaluation</label>
                  <select
                    name="preferredArea"
                    value={formData.preferredArea}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none"
                  >
                    <option value="1">Area 1: Curriculum Compliance</option>
                    <option value="3">Area 3: Instructional Design</option>
                  </select>
                  {errors.preferredArea && <p className="text-red-500 text-sm">{errors.preferredArea}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose">Preferred Grade Level</label>
                  <select
                    name="preferredGradeLevel"
                    value={formData.preferredGradeLevel}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none"
                  >
                    <option value="5">Grade 5</option>
                    <option value="8">Grade 8</option>
                  </select>
                  {errors.preferredGradeLevel && <p className="text-red-500 text-sm">{errors.preferredGradeLevel}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none"
                    placeholder="Enter your 11-digit phone number"
                  />
                  {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose">DepEd Email</label>
                  <input
                    type="email"
                    name="depedEmail"
                    value={formData.depedEmail}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none"
                    placeholder="Enter your DepEd email (@deped.gov.ph)"
                  />
                  {errors.depedEmail && <p className="text-red-500 text-sm">{errors.depedEmail}</p>}
                </div>
              </div>
              {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
              <div className="pt-4 flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none hover:bg-blue-600"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration; 