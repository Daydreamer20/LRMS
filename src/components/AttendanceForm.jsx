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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Event Attendance Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block mb-1">Region and Division:</label>
          <input
            type="text"
            name="regionDivision"
            value={formData.regionDivision}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.regionDivision && <p className="text-red-500 text-sm">{errors.regionDivision}</p>}
        </div>

        <div>
          <label className="block mb-1">Designation:</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
        </div>

        <div>
          <label className="block mb-1">Preferred Area of Evaluation:</label>
          <select
            name="evaluationArea"
            value={formData.evaluationArea}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Area</option>
            <option value="1">Area 1: Curriculum Compliance</option>
            <option value="3">Area 3: Instructional Design and Organization of Materials</option>
          </select>
          {errors.evaluationArea && <p className="text-red-500 text-sm">{errors.evaluationArea}</p>}
        </div>

        <div>
          <label className="block mb-1">Preferred Grade Level:</label>
          <select
            name="gradeLevel"
            value={formData.gradeLevel}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Grade</option>
            <option value="5">Grade 5</option>
            <option value="8">Grade 8</option>
          </select>
          {errors.gradeLevel && <p className="text-red-500 text-sm">{errors.gradeLevel}</p>}
        </div>

        <div>
          <label className="block mb-1">Contact Number:</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
        </div>

        <div>
          <label className="block mb-1">DepEd Email Address:</label>
          <input
            type="email"
            name="depedEmail"
            value={formData.depedEmail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="example@deped.gov.ph"
          />
          {errors.depedEmail && <p className="text-red-500 text-sm">{errors.depedEmail}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
}

export default AttendanceForm; 