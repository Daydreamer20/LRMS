import { useState } from 'react';
import '../styles/main.css';

function AttendanceForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    regionDivision: '',
    designation: '',
    evaluationArea: '',
    gradeLevel: '',
    contactNumber: '',
    depedEmail: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.regionDivision.trim()) {
      newErrors.regionDivision = 'Region and Division is required';
    }
    
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    
    if (!['1', '3'].includes(formData.evaluationArea)) {
      newErrors.evaluationArea = 'Please select either Area 1 or Area 3';
    }
    
    if (!['5', '8'].includes(formData.gradeLevel)) {
      newErrors.gradeLevel = 'Please select either Grade 5 or Grade 8';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }
    
    if (!formData.depedEmail.trim()) {
      newErrors.depedEmail = 'DepEd email is required';
    } else if (!formData.depedEmail.endsWith('@deped.gov.ph')) {
      newErrors.depedEmail = 'Please use a valid DepEd email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Store in localStorage for now (temporary solution)
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        const newSubmission = {
          id: Date.now(),
          ...formData,
          submittedAt: new Date().toISOString().split('T')[0]
        };
        submissions.push(newSubmission);
        localStorage.setItem('submissions', JSON.stringify(submissions));
        
        // Reset form
        setFormData({
          fullName: '',
          regionDivision: '',
          designation: '',
          evaluationArea: '',
          gradeLevel: '',
          contactNumber: '',
          depedEmail: ''
        });
        
        alert('Registration submitted successfully!');
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-[#ff6b35] w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Online Registration</h2>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f8fafc] border-0 rounded-lg focus:ring-2 focus:ring-[#ff6b35] transition-all"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Region and Division */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region and Division
              </label>
              <input
                type="text"
                name="regionDivision"
                value={formData.regionDivision}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f8fafc] border-0 rounded-lg focus:ring-2 focus:ring-[#ff6b35] transition-all"
                placeholder="e.g., Region IV-A CALABARZON"
              />
              {errors.regionDivision && (
                <p className="mt-1 text-sm text-red-500">{errors.regionDivision}</p>
              )}
            </div>

            {/* Evaluation Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area of Evaluation
              </label>
              <select
                name="evaluationArea"
                value={formData.evaluationArea}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f8fafc] border-0 rounded-lg focus:ring-2 focus:ring-[#ff6b35] transition-all"
              >
                <option value="">Select Area</option>
                <option value="1">Area 1: Curriculum Compliance</option>
                <option value="3">Area 3: Instructional Design</option>
              </select>
              {errors.evaluationArea && (
                <p className="mt-1 text-sm text-red-500">{errors.evaluationArea}</p>
              )}
            </div>

            {/* Grade Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Level
              </label>
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f8fafc] border-0 rounded-lg focus:ring-2 focus:ring-[#ff6b35] transition-all"
              >
                <option value="">Select Grade</option>
                <option value="5">Grade 5</option>
                <option value="8">Grade 8</option>
              </select>
              {errors.gradeLevel && (
                <p className="mt-1 text-sm text-red-500">{errors.gradeLevel}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f8fafc] border-0 rounded-lg focus:ring-2 focus:ring-[#ff6b35] transition-all"
                placeholder="Enter your contact number"
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.contactNumber}</p>
              )}
            </div>

            {/* DepEd Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DepEd Email Address
              </label>
              <input
                type="email"
                name="depedEmail"
                value={formData.depedEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f8fafc] border-0 rounded-lg focus:ring-2 focus:ring-[#ff6b35] transition-all"
                placeholder="example@deped.gov.ph"
              />
              {errors.depedEmail && (
                <p className="mt-1 text-sm text-red-500">{errors.depedEmail}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#ff6b35] text-white py-3 rounded-lg hover:bg-[#ff5722] transition-colors font-medium"
            >
              Register now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AttendanceForm; 