const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  criteria: {
    participation: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    contribution: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    expertise: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    collaboration: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  overallScore: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: function() {
      if (!this.criteria) return 0;
      const scores = Object.values(this.criteria);
      return scores.reduce((a, b) => a + b, 0) / scores.length;
    }
  },
  feedback: {
    strengths: [String],
    areasForImprovement: [String]
  },
  notes: {
    type: String
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp and calculate overall score on save
ratingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.criteria) {
    const scores = [
      this.criteria.participation,
      this.criteria.contribution,
      this.criteria.expertise,
      this.criteria.collaboration
    ];
    this.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  }
  next();
});

module.exports = mongoose.model('Rating', ratingSchema); 