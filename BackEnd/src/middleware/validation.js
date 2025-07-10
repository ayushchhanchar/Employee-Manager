const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Employee validation rules
// const employeeValidation = [
//   body('personalInfo.firstName').notEmpty().withMessage('First name is required'),
//   body('personalInfo.lastName').notEmpty().withMessage('Last name is required'),
//   body('personalInfo.email').isEmail().withMessage('Valid email is required'),
//   body('personalInfo.phone').notEmpty().withMessage('Phone number is required'),
//   body('workInfo.department').notEmpty().withMessage('Department is required'),
//   body('workInfo.designation').notEmpty().withMessage('Designation is required'),
//   body('workInfo.joiningDate').isISO8601().withMessage('Valid joining date is required'),
//   body('status').optional().isIn(['Active', 'Inactive', 'Terminated'])
// ];
const employeeUpdateValidation = [
  body('personalInfo.firstName').optional().notEmpty(),
  body('personalInfo.lastName').optional().notEmpty(),
  body('personalInfo.email').optional().isEmail(),
  body('personalInfo.phone').optional().notEmpty(),
  body('workInfo.department').optional().notEmpty(),
  body('workInfo.designation').optional().notEmpty(),
  body('workInfo.joiningDate').optional().isISO8601(),
  body('status').optional().isIn(['Active', 'Inactive', 'Terminated'])
];

// Leave validation rules
const leaveValidation = [
  body('leaveType').isIn(['Annual', 'Sick', 'Maternity', 'Paternity', 'Emergency', 'Casual'])
    .withMessage('Valid leave type is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('reason').notEmpty().withMessage('Reason is required')
];

// Attendance validation rules
const attendanceValidation = [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('status').isIn(['Present', 'Absent', 'Half Day', 'Late', 'Holiday', 'Leave'])
    .withMessage('Valid status is required')
];

// Announcement validation rules
const announcementValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('type').isIn(['General', 'Important', 'Urgent', 'Holiday', 'Event'])
    .withMessage('Valid type is required')
];

// Holiday validation rules
const holidayValidation = [
  body('name').notEmpty().withMessage('Holiday name is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('type').isIn(['National', 'Regional', 'Company', 'Optional'])
    .withMessage('Valid type is required')
];

module.exports = {
  validate,
  employeeUpdateValidation,
  leaveValidation,
  attendanceValidation,
  announcementValidation,
  holidayValidation
};