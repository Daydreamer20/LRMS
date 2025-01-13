const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  division: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  preferredArea: {
    type: String,
    required: true
  },
  preferredGradeLevel: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^\d{11}$/
  },
  depedEmail: {
    type: String,
    required: true,
    unique: true,
    match: /@deped\.gov\.ph$/
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 