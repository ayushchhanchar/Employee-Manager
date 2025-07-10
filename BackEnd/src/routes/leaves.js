const express = require('express');
const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { leaveValidation, validate } = require('../middleware/validation');
const { sendEmail } = require('../services/emailService');
const NotificationService = require('../services/notificationService');
const router = express.Router();

// Get leave requests
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, leaveType, employeeId, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    
    // Role-based filtering
    if (req.user.role === 'user') {
      const employee = await Employee.findOne({ user: req.user._id });
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee profile not found' });
      }
      filter.employee = employee._id;
    } else if (employeeId) {
      filter.employee = employeeId;
    }

    if (status) filter.status = status;
    if (leaveType) filter.leaveType = leaveType;
    
    // Date range filter
    if (startDate || endDate) {
      filter.$or = [
        {
          startDate: {
            ...(startDate && { $gte: new Date(startDate) }),
            ...(endDate && { $lte: new Date(endDate) })
          }
        },
        {
          endDate: {
            ...(startDate && { $gte: new Date(startDate) }),
            ...(endDate && { $lte: new Date(endDate) })
          }
        }
      ];
    }

    const leaves = await Leave.find(filter)
      .populate({
        path: 'employee',
        select: 'personalInfo.firstName personalInfo.lastName user',
        populate: {
          path: 'user',
          select: 'email username'
        }
      })
      .populate('approvedBy', 'username email')
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Leave.countDocuments(filter);

    res.json({
      success: true,
      data: leaves,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + leaves.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Apply for leave
router.post('/apply', authMiddleware, leaveValidation, validate, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, teamEmail, handoverNotes } = req.body;

    const employee = await Employee.findOne({ user: req.user._id })
      .populate('user', 'username email');
    
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start date cannot be in the past' 
      });
    }

    if (end < start) {
      return res.status(400).json({ 
        success: false, 
        message: 'End date cannot be before start date' 
      });
    }

    // Check for overlapping leaves
    const overlappingLeave = await Leave.findOne({
      employee: employee._id,
      status: { $in: ['Pending', 'Approved'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (overlappingLeave) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have a leave request for overlapping dates' 
      });
    }

    const leave = new Leave({
      employee: employee._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      teamEmail,
      handoverNotes
    });

    await leave.save();
    await leave.populate('employee', 'employeeId personalInfo.firstName personalInfo.lastName workInfo.department');

    // Send notification to HR/Admin
    const hrUsers = await User.find({ role: { $in: ['admin', 'hr'] } });
    for (const hrUser of hrUsers) {
      await NotificationService.sendLeaveNotification({
        ...leave.toObject(),
        hrUserId: hrUser._id
      }, 'applied');
    }

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update leave status (Admin/HR only)
router.put('/:id/status', authMiddleware, roleAuth('admin', 'hr'), async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Must be Approved or Rejected' 
      });
    }

    const leave = await Leave.findById(req.params.id)
      .populate('employee', 'personalInfo.firstName personalInfo.lastName personalInfo.email user');

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Leave request has already been processed' 
      });
    }

    leave.status = status;
    leave.approvedBy = req.user._id;
    leave.approvedDate = new Date();
    
    if (status === 'Rejected' && rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();

    // Send email notification
    await sendEmail(
      leave.employee.user.email,  // ✅ now properly populated
      'leaveStatusUpdate',
      [
        `${leave.employee.personalInfo.firstName} ${leave.employee.personalInfo.lastName}`,
        leave.leaveType,
        status,
        leave.startDate,
        leave.endDate,
        leave.reason
      ]
    );

    // Send in-app notification
    await NotificationService.sendLeaveNotification(leave, status.toLowerCase());

    res.json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      data: leave
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel leave request
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    // Check if user owns this leave request
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee || leave.employee.toString() !== employee._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Can only cancel pending leave requests' 
      });
    }

    leave.status = 'Cancelled';
    await leave.save();

    res.json({
      success: true,
      message: 'Leave request cancelled successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get leave balance
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);

    // Get approved leaves for current year
    const approvedLeaves = await Leave.find({
      employee: employee._id,
      status: 'Approved',
      startDate: { $gte: yearStart, $lte: yearEnd }
    });

    // Calculate leave balance (assuming 21 days annual leave)
    const leaveTypes = {
      Annual: { total: 21, used: 0 },
      Sick: { total: 10, used: 0 },
      Casual: { total: 7, used: 0 },
      Maternity: { total: 180, used: 0 },
      Paternity: { total: 15, used: 0 },
      Emergency: { total: 5, used: 0 }
    };

    approvedLeaves.forEach(leave => {
      if (leaveTypes[leave.leaveType]) {
        leaveTypes[leave.leaveType].used += leave.totalDays;
      }
    });

    // Calculate remaining days
    Object.keys(leaveTypes).forEach(type => {
      leaveTypes[type].remaining = Math.max(0, leaveTypes[type].total - leaveTypes[type].used);
    });

    res.json({
      success: true,
      data: {
        year: currentYear,
        leaveTypes,
        totalUsed: approvedLeaves.reduce((sum, leave) => sum + leave.totalDays, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get leave statistics (Admin/HR only)
router.get('/statistics', authMiddleware, roleAuth('admin', 'hr'), async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    const stats = await Leave.aggregate([
      {
        $match: {
          appliedDate: { $gte: yearStart, $lte: yearEnd }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]);

    const leaveTypeStats = await Leave.aggregate([
      {
        $match: {
          appliedDate: { $gte: yearStart, $lte: yearEnd },
          status: 'Approved'
        }
      },
      {
        $group: {
          _id: '$leaveType',
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        year,
        statusStats: stats,
        leaveTypeStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;