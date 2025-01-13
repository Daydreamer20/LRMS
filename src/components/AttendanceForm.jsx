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
    <div className="form-container py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-2xl mx-auto form-card bg-white rounded-xl overflow-hidden">
        {/* Enhanced Header Section */}
        <div className="form-header p-8 text-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Learning Resource Evaluator
          </h2>
          <p className="text-center text-blue-100 text-lg">
            Registration Form
          </p>
          <div className="mt-4 text-sm text-center text-blue-100">
            Please complete all required fields marked with an asterisk (*)
          </div>
        </div>

        {/* Enhanced Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Region and Division with enhanced styling */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Region and Division <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="regionDivision"
              value={formData.regionDivision}
              onChange={handleChange}
              className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Region IV-A CALABARZON"
            />
            {errors.regionDivision && (
              <p className="text-red-500 text-sm mt-1">{errors.regionDivision}</p>
            )}
          </div>

          {/* Two Column Layout with enhanced styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Evaluation Area */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Area of Evaluation <span className="text-red-500">*</span>
              </label>
              <select
                name="evaluationArea"
                value={formData.evaluationArea}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Area</option>
                <option value="1">Area 1: Curriculum Compliance</option>
                <option value="3">Area 3: Instructional Design</option>
              </select>
              {errors.evaluationArea && (
                <p className="text-red-500 text-sm mt-1">{errors.evaluationArea}</p>
              )}
            </div>

            {/* Grade Level */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Grade Level <span className="text-red-500">*</span>
              </label>
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Grade</option>
                <option value="5">Grade 5</option>
                <option value="8">Grade 8</option>
              </select>
              {errors.gradeLevel && (
                <p className="text-red-500 text-sm mt-1">{errors.gradeLevel}</p>
              )}
            </div>
          </div>

          {/* Contact Information with enhanced styling */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your contact number"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
            )}
          </div>

          {/* DepEd Email with enhanced styling */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              DepEd Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="depedEmail"
              value={formData.depedEmail}
              onChange={handleChange}
              className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="example@deped.gov.ph"
            />
            {errors.depedEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.depedEmail}</p>
            )}
          </div>

          {/* Submit Button with enhanced styling */}
          <div className="pt-6">
            <button
              type="submit"
              className="submit-button w-full py-4 px-6 text-white text-lg font-semibold rounded-lg"
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