const express = require('express');
const Holiday = require('../models/Holiday');
const authMiddleware = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { holidayValidation, validate } = require('../middleware/validation');
const router = express.Router();

// Get holidays
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, year, type, month } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    
    if (type) filter.type = type;
    
    // Year filter
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31);
    filter.date = { $gte: yearStart, $lte: yearEnd };

    // Month filter
    if (month) {
      const monthStart = new Date(currentYear, parseInt(month) - 1, 1);
      const monthEnd = new Date(currentYear, parseInt(month), 0);
      filter.date = { $gte: monthStart, $lte: monthEnd };
    }

    const holidays = await Holiday.find(filter)
      .populate('createdBy', 'username email')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Holiday.countDocuments(filter);

    res.json({
      success: true,
      data: holidays,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + holidays.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create holiday (Admin/HR only)
router.post('/', authMiddleware, roleAuth('admin', 'hr'), holidayValidation, validate, async (req, res) => {
  try {
    const { name, date, type, description, isRecurring, applicableFor, department, location } = req.body;

    const holiday = new Holiday({
      name,
      date: new Date(date),
      type,
      description,
      isRecurring,
      applicableFor,
      department,
      location,
      createdBy: req.user._id
    });

    await holiday.save();
    await holiday.populate('createdBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'Holiday created successfully',
      data: holiday
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update holiday (Admin/HR only)
router.put('/:id', authMiddleware, roleAuth('admin', 'hr'), holidayValidation, validate, async (req, res) => {
  try {
    const { name, date, type, description, isRecurring, applicableFor, department, location } = req.body;

    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) {
      return res.status(404).json({ success: false, message: 'Holiday not found' });
    }

    holiday.name = name;
    holiday.date = new Date(date);
    holiday.type = type;
    holiday.description = description;
    holiday.isRecurring = isRecurring;
    holiday.applicableFor = applicableFor;
    holiday.department = department;
    holiday.location = location;

    await holiday.save();
    await holiday.populate('createdBy', 'username email');

    res.json({
      success: true,
      message: 'Holiday updated successfully',
      data: holiday
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete holiday (Admin/HR only)
router.delete('/:id', authMiddleware, roleAuth('admin', 'hr'), async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) {
      return res.status(404).json({ success: false, message: 'Holiday not found' });
    }

    await Holiday.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Holiday deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get upcoming holidays
router.get('/upcoming', authMiddleware, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const today = new Date();

    const holidays = await Holiday.find({
      date: { $gte: today }
    })
      .sort({ date: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: holidays
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get holidays for calendar
router.get('/calendar', authMiddleware, async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    const holidays = await Holiday.find({
      date: { $gte: yearStart, $lte: yearEnd }
    }).sort({ date: 1 });

    // Format for calendar
    const calendarEvents = holidays.map(holiday => ({
      id: holiday._id,
      title: holiday.name,
      date: holiday.date.toISOString().split('T')[0],
      type: holiday.type,
      description: holiday.description,
      allDay: true,
      backgroundColor: getHolidayColor(holiday.type),
      borderColor: getHolidayColor(holiday.type)
    }));

    res.json({
      success: true,
      data: calendarEvents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function to get holiday colors
function getHolidayColor(type) {
  const colors = {
    'National': '#e74c3c',
    'Regional': '#f39c12',
    'Company': '#3498db',
    'Optional': '#95a5a6'
  };
  return colors[type] || '#3498db';
}

module.exports = router;