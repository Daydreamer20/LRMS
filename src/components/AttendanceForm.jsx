import { useState } from 'react';

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="bg-blue-600 text-white rounded-t-xl p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Learning Resource Evaluator Registration
          </h2>
          <p className="mt-2 text-center text-blue-100">
            Please complete all required fields to register as an LRE
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          {/* Region and Division */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Region and Division <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="regionDivision"
              value={formData.regionDivision}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Region IV-A CALABARZON"
            />
            {errors.regionDivision && (
              <p className="text-red-500 text-sm">{errors.regionDivision}</p>
            )}
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Teacher III"
            />
            {errors.designation && (
              <p className="text-red-500 text-sm">{errors.designation}</p>
            )}
          </div>

          {/* Two Column Layout for Evaluation Area and Grade Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Evaluation Area */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Preferred Area of Evaluation <span className="text-red-500">*</span>
              </label>
              <select
                name="evaluationArea"
                value={formData.evaluationArea}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Area</option>
                <option value="1">Area 1: Curriculum Compliance</option>
                <option value="3">Area 3: Instructional Design</option>
              </select>
              {errors.evaluationArea && (
                <p className="text-red-500 text-sm">{errors.evaluationArea}</p>
              )}
            </div>

            {/* Grade Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Preferred Grade Level <span className="text-red-500">*</span>
              </label>
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Grade</option>
                <option value="5">Grade 5</option>
                <option value="8">Grade 8</option>
              </select>
              {errors.gradeLevel && (
                <p className="text-red-500 text-sm">{errors.gradeLevel}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your contact number"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm">{errors.contactNumber}</p>
            )}
          </div>

          {/* DepEd Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              DepEd Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="depedEmail"
              value={formData.depedEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="example@deped.gov.ph"
            />
            {errors.depedEmail && (
              <p className="text-red-500 text-sm">{errors.depedEmail}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Submit Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AttendanceForm; 