const express = require('express');
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const authMiddleware = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const router = express.Router();

// Get payroll records
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, month, year, employeeId, status } = req.query;
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

    if (month) filter['payPeriod.month'] = parseInt(month);
    if (year) filter['payPeriod.year'] = parseInt(year);
    if (status) filter.status = status;

    const payrolls = await Payroll.find(filter)
      .populate('employee', 'employeeId personalInfo.firstName personalInfo.lastName workInfo.department')
      .populate('processedBy', 'username email')
      .sort({ 'payPeriod.year': -1, 'payPeriod.month': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payroll.countDocuments(filter);

    res.json({
      success: true,
      data: payrolls,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + payrolls.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate payroll (Admin/HR only)
router.post('/generate', authMiddleware, roleAuth('admin', 'hr'), async (req, res) => {
  try {
    const { employeeId, month, year } = req.body;

    if (!employeeId || !month || !year) {
      return res.status(400).json({ 
        success: false, 
        message: 'Employee ID, month, and year are required' 
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Check if payroll already exists
    const existingPayroll = await Payroll.findOne({
      employee: employeeId,
      'payPeriod.month': month,
      'payPeriod.year': year
    });

    if (existingPayroll) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payroll already exists for this period' 
      });
    }

    // Calculate working days and attendance
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);
    const workingDays = getWorkingDays(monthStart, monthEnd);

    const attendance = await Attendance.find({
      employee: employeeId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const presentDays = attendance.filter(a => a.status === 'Present').length;
    const leaveDays = attendance.filter(a => a.status === 'Leave').length;

    // Calculate salary components
    const basicSalary = employee.workInfo.salary.basic || 0;
    const dailySalary = basicSalary / workingDays;
    const earnedBasic = dailySalary * presentDays;

    const payroll = new Payroll({
      employee: employeeId,
      payPeriod: { month, year },
      basicSalary: earnedBasic,
      allowances: {
        hra: earnedBasic * 0.4, // 40% HRA
        transport: 2000,
        medical: 1500,
        other: 0
      },
      deductions: {
        tax: earnedBasic * 0.1, // 10% tax
        pf: earnedBasic * 0.12, // 12% PF
        insurance: 500,
        other: 0
      },
      workingDays,
      presentDays,
      leaveDays,
      processedBy: req.user._id
    });

    await payroll.save();
    await payroll.populate('employee', 'employeeId personalInfo.firstName personalInfo.lastName');

    res.status(201).json({
      success: true,
      message: 'Payroll generated successfully',
      data: payroll
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update payroll (Admin/HR only)
router.put('/:id', authMiddleware, roleAuth('admin', 'hr'), async (req, res) => {
  try {
    const { allowances, deductions, bonus, overtime } = req.body;

    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }

    if (payroll.status === 'Paid') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot update paid payroll' 
      });
    }

    // Update fields
    if (allowances) payroll.allowances = { ...payroll.allowances, ...allowances };
    if (deductions) payroll.deductions = { ...payroll.deductions, ...deductions };
    if (bonus !== undefined) payroll.bonus = bonus;
    if (overtime) payroll.overtime = { ...payroll.overtime, ...overtime };

    await payroll.save();

    res.json({
      success: true,
      message: 'Payroll updated successfully',
      data: payroll
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Process payroll (Admin/HR only)
router.put('/:id/process', authMiddleware, roleAuth('admin', 'hr'), async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }

    if (payroll.status !== 'Draft') {
      return res.status(400).json({ 
        success: false, 
        message: 'Payroll is already processed' 
      });
    }

    payroll.status = 'Processed';
    payroll.processedDate = new Date();
    await payroll.save();

    res.json({
      success: true,
      message: 'Payroll processed successfully',
      data: payroll
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark payroll as paid (Admin/HR only)
router.put('/:id/pay', authMiddleware, roleAuth('admin', 'hr'), async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll not found' });
    }

    if (payroll.status !== 'Processed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Payroll must be processed before payment' 
      });
    }

    payroll.status = 'Paid';
    payroll.paymentDate = new Date();
    await payroll.save();

    res.json({
      success: true,
      message: 'Payroll marked as paid successfully',
      data: payroll
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get payroll summary
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    let filter = { 'payPeriod.year': parseInt(year) };
    
    // Role-based filtering
    if (req.user.role === 'user') {
      const employee = await Employee.findOne({ user: req.user._id });
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee profile not found' });
      }
      filter.employee = employee._id;
    }

    const payrolls = await Payroll.find(filter)
      .populate('employee', 'employeeId personalInfo.firstName personalInfo.lastName');

    // Calculate summary
    const summary = {
      totalPayrolls: payrolls.length,
      totalEarnings: payrolls.reduce((sum, p) => sum + p.totalEarnings, 0),
      totalDeductions: payrolls.reduce((sum, p) => sum + p.totalDeductions, 0),
      totalNetSalary: payrolls.reduce((sum, p) => sum + p.netSalary, 0),
      statusBreakdown: {
        Draft: payrolls.filter(p => p.status === 'Draft').length,
        Processed: payrolls.filter(p => p.status === 'Processed').length,
        Paid: payrolls.filter(p => p.status === 'Paid').length
      }
    };

    res.json({
      success: true,
      data: {
        year: parseInt(year),
        summary,
        payrolls: req.user.role === 'user' ? payrolls : undefined
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function to calculate working days
function getWorkingDays(startDate, endDate) {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

module.exports = router;