const express = require('express');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const authMiddleware = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { attendanceValidation, validate } = require('../middleware/validation');
const router = express.Router();

// Get attendance records
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, employeeId, status } = req.query;
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

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (status) filter.status = status;

    const attendance = await Attendance.find(filter)
      .populate('employee', 'employeeId personalInfo.firstName personalInfo.lastName workInfo.department')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(filter);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + attendance.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check in
router.post('/checkin', authMiddleware, async (req, res) => {
  try {
    console.log('🟢 Check-in API called by user:', req.user);

    const { location } = req.body;

    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      console.log('🔴 Employee profile not found');
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ employee: employee._id, date: today });
    console.log('📋 Existing attendance for today:', attendance);

    if (attendance && attendance.checkIn) {
      return res.status(400).json({ success: false, message: 'Already checked in today' });
    }

    const checkInTime = new Date();
    if (!attendance) {
      attendance = new Attendance({
        employee: employee._id,
        date: today,
        checkIn: checkInTime,
        status: 'Present',
        location: { checkInLocation: location }
      });
    } else {
      attendance.checkIn = checkInTime;
      attendance.status = 'Present';
      attendance.location.checkInLocation = location;
    }

    await attendance.save();
    console.log('✅ Attendance saved:', attendance);

    res.json({ success: true, message: 'Checked in successfully', data: attendance });
  } catch (error) {
    console.error('🔥 Error during check-in:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


// Check out
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { location } = req.body;
    
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employee._id,
      date: today
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please check in first' 
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already checked out today' 
      });
    }

    attendance.checkOut = new Date();
    attendance.location.checkOutLocation = location;
    
    await attendance.save();

    res.json({
      success: true,
      message: 'Checked out successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark attendance (Admin/HR only)
router.post('/mark', authMiddleware, roleAuth('admin', 'hr'), attendanceValidation, validate, async (req, res) => {
  try {
    const { employeeId, date, status, checkIn, checkOut, notes } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: attendanceDate
    });

    if (attendance) {
      // Update existing record
      attendance.status = status;
      attendance.notes = notes;
      if (checkIn) attendance.checkIn = new Date(checkIn);
      if (checkOut) attendance.checkOut = new Date(checkOut);
    } else {
      // Create new record
      attendance = new Attendance({
        employee: employeeId,
        date: attendanceDate,
        status,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        notes
      });
    }

    await attendance.save();

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get attendance summary
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const { month, year, employeeId } = req.query;
    
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

    // Date filter
    const currentMonth = month ? parseInt(month) - 1 : new Date().getMonth();
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    
    filter.date = { $gte: startDate, $lte: endDate };

    const attendance = await Attendance.find(filter);
    
    // Calculate summary
    const summary = {
      totalDays: endDate.getDate(),
      presentDays: attendance.filter(a => a.status === 'Present').length,
      absentDays: attendance.filter(a => a.status === 'Absent').length,
      halfDays: attendance.filter(a => a.status === 'Half Day').length,
      lateDays: attendance.filter(a => a.status === 'Late').length,
      holidays: attendance.filter(a => a.status === 'Holiday').length,
      leaves: attendance.filter(a => a.status === 'Leave').length,
      totalHours: attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0)
    };

    res.json({
      success: true,
      data: {
        summary,
        attendance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get today's attendance status
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employee._id,
      date: today
    });

    res.json({
      success: true,
      data: attendance || { status: 'Not marked', date: today }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;