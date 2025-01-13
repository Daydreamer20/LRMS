const { check } = require('express-validator');

exports.registerValidation = [
  check('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  check('region')
    .trim()
    .notEmpty()
    .withMessage('Region is required'),
  check('division')
    .trim()
    .notEmpty()
    .withMessage('Division is required'),
  check('designation')
    .trim()
    .notEmpty()
    .withMessage('Designation is required'),
  check('preferredArea')
    .trim()
    .notEmpty()
    .withMessage('Preferred area is required')
    .isIn(['Area 1', 'Area 3'])
    .withMessage('Invalid preferred area'),
  check('preferredGradeLevel')
    .trim()
    .notEmpty()
    .withMessage('Preferred grade level is required')
    .isIn([
      'Kindergarten',
      'Grade 1',
      'Grade 2',
      'Grade 3',
      'Grade 4',
      'Grade 5',
      'Grade 6',
      'Grade 7',
      'Grade 8',
      'Grade 9',
      'Grade 10',
      'Grade 11',
      'Grade 12'
    ])
    .withMessage('Invalid grade level'),
  check('contactNumber')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(/^\d{11}$/)
    .withMessage('Contact number must be 11 digits'),
  check('depedEmail')
    .trim()
    .notEmpty()
    .withMessage('DepEd email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .matches(/@deped\.gov\.ph$/)
    .withMessage('Must be a DepEd email address'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

exports.loginValidation = [
  check('depedEmail')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

exports.eventValidation = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  check('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  check('time')
    .trim()
    .notEmpty()
    .withMessage('Time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:MM)'),
  check('areaOfEvaluation')
    .trim()
    .notEmpty()
    .withMessage('Area of evaluation is required')
    .isIn(['Area 1', 'Area 3'])
    .withMessage('Invalid area of evaluation'),
  check('gradeLevel')
    .trim()
    .notEmpty()
    .withMessage('Grade level is required')
    .isIn([
      'Kindergarten',
      'Grade 1',
      'Grade 2',
      'Grade 3',
      'Grade 4',
      'Grade 5',
      'Grade 6',
      'Grade 7',
      'Grade 8',
      'Grade 9',
      'Grade 10',
      'Grade 11',
      'Grade 12'
    ])
    .withMessage('Invalid grade level'),
  check('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  check('maxParticipants')
    .isInt({ min: 1 })
    .withMessage('Maximum participants must be at least 1')
];

exports.ratingValidation = [
  check('criteria.participation')
    .isInt({ min: 1, max: 5 })
    .withMessage('Participation rating must be between 1 and 5'),
  check('criteria.contribution')
    .isInt({ min: 1, max: 5 })
    .withMessage('Contribution rating must be between 1 and 5'),
  check('criteria.expertise')
    .isInt({ min: 1, max: 5 })
    .withMessage('Expertise rating must be between 1 and 5'),
  check('criteria.collaboration')
    .isInt({ min: 1, max: 5 })
    .withMessage('Collaboration rating must be between 1 and 5'),
  check('feedback.strengths')
    .isArray()
    .withMessage('Strengths must be an array'),
  check('feedback.strengths.*')
    .trim()
    .notEmpty()
    .withMessage('Strength items cannot be empty'),
  check('feedback.areasForImprovement')
    .isArray()
    .withMessage('Areas for improvement must be an array'),
  check('feedback.areasForImprovement.*')
    .trim()
    .notEmpty()
    .withMessage('Area for improvement items cannot be empty')
]; 