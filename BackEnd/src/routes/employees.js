const express = require('express');
const Employee = require('../models/Employee');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { employeeUpdateValidation, validate } = require('../middleware/validation');
const { sendEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Get all employees (Admin/HR only)
router.get('/', authMiddleware, roleAuth('admin', 'hr'), async (req, res) => {
  try {
    const { page = 1, limit = 10, department, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    if (department) filter['workInfo.department'] = department;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(filter)
      .populate('user', 'username email role')
      .populate('workInfo.reportingManager', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Employee.countDocuments(filter);

    res.json({
      success: true,
      data: employees,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + employees.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get employee by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('user', 'username email role')
      .populate('workInfo.reportingManager', 'username email');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Check if user can access this employee data
    if (req.user.role === 'user' && employee.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new employee (Admin/HR only)
router.post('/', authMiddleware, roleAuth('admin', 'hr'), employeeUpdateValidation, validate, async (req, res) => {
  try {
    const { personalInfo, workInfo, createUser = true } = req.body;

    let user = null;
    
    if (createUser) {
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Create user account
      user = new User({
        username: personalInfo.email.split('@')[0],
        email: personalInfo.email,
        password: hashedPassword,
        role: 'user'
      });
      await user.save();

      // Send welcome email
      await sendEmail(
        personalInfo.email,
        'welcome',
        [personalInfo.firstName + ' ' + personalInfo.lastName, personalInfo.email, tempPassword]
      );
    } else {
      // Find existing user
      user = await User.findOne({ email: personalInfo.email });
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: 'User not found. Please create user account first.' 
        });
      }
    }

    // Create employee profile
    const employee = new Employee({
      personalInfo,
      workInfo,
      user: user._id
    });

    await employee.save();
    await employee.populate('user', 'username email role');

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update employee
// Update employee (Admin/HR can update everything, user can update limited fields)
router.put('/:id', authMiddleware, employeeUpdateValidation, validate, async (req, res) => {
  try {
    const { personalInfo, workInfo, status } = req.body;


    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Safeguard permission check
    if (req.user?.role === 'user' && employee.user?.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Apply updates
    if (personalInfo) {
      for (const key in personalInfo) {
        if (personalInfo[key] !== undefined) {
          employee.personalInfo[key] = personalInfo[key];
        }
      }
    }

    if (workInfo && ['admin', 'hr'].includes(req.user.role)) {
      for (const key in workInfo) {
        if (workInfo[key] !== undefined) {
          employee.workInfo[key] = workInfo[key];
        }
      }
  }

    if (status && ['admin', 'hr'].includes(req.user?.role)) {
      employee.status = status;
    }

    try {
      await employee.save();
      await employee.populate('user', 'username email role');
    } catch (saveError) {
      console.error('Save failed:', saveError);
      return res.status(500).json({ success: false, message: 'Error saving employee data', error: saveError.message });
    }

    return res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });

  } catch (error) {
    console.error('Update route error:', error); // Detailed backend error
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});


// Delete employee (Admin only)
router.delete('/:id', authMiddleware, roleAuth('admin'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Soft delete - mark as terminated
    employee.status = 'Terminated';
    await employee.save();

    res.json({
      success: true,
      message: 'Employee terminated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get employee dashboard stats
router.get('/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    let stats = {};

    if (['admin', 'hr'].includes(req.user.role)) {
      // Admin/HR dashboard stats
      const totalEmployees = await Employee.countDocuments({ status: 'Active' });
      const totalDepartments = await Employee.distinct('workInfo.department').length;
      const newHires = await Employee.countDocuments({
        'workInfo.joiningDate': {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      });

      stats = {
        totalEmployees,
        totalDepartments,
        newHires,
        activeEmployees: totalEmployees
      };
    } else {
      // Employee dashboard stats
      const employee = await Employee.findOne({ user: req.user._id });
      if (employee) {
        stats = {
          employeeId: employee.employeeId,
          department: employee.workInfo.department,
          designation: employee.workInfo.designation,
          joiningDate: employee.workInfo.joiningDate
        };
      }
    }

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;