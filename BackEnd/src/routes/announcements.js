const express = require('express');
const Announcement = require('../models/Announcement');
const Employee = require('../models/Employee');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { announcementValidation, validate } = require('../middleware/validation');
const NotificationService = require('../services/notificationService');
const router = express.Router();

// Get announcements
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, priority } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = { isActive: true };
    
    // Check expiry
    filter.$or = [
      { expiryDate: { $exists: false } },
      { expiryDate: null },
      { expiryDate: { $gte: new Date() } }
    ];

    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    // Filter by target audience
    const employee = await Employee.findOne({ user: req.user._id });
    if (employee) {
      filter.$and = [
        {
          $or: [
            { targetAudience: 'All' },
            { targetAudience: 'Employees' },
            { targetAudience: 'Department', department: employee.workInfo.department },
            ...(req.user.role === 'admin' ? [{ targetAudience: 'Managers' }] : []),
            ...(req.user.role === 'hr' ? [{ targetAudience: 'HR' }] : [])
          ]
        }
      ];
    }

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Announcement.countDocuments(filter);

    res.json({
      success: true,
      data: announcements,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + announcements.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create announcement (Admin/HR only)
router.post('/', authMiddleware, roleAuth('admin', 'hr'), announcementValidation, validate, async (req, res) => {
  try {
    const { title, content, type, priority, targetAudience, department, expiryDate } = req.body;

    const announcement = new Announcement({
      title,
      content,
      type,
      priority,
      targetAudience,
      department,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      createdBy: req.user._id
    });

    await announcement.save();
    await announcement.populate('createdBy', 'username email');

    // Send notifications to target audience
    let recipients = [];
    
    switch (targetAudience) {
      case 'All':
        recipients = await User.find({}, '_id');
        break;
      case 'Employees':
        recipients = await User.find({ role: 'user' }, '_id');
        break;
      case 'Managers':
        recipients = await User.find({ role: 'admin' }, '_id');
        break;
      case 'HR':
        recipients = await User.find({ role: 'hr' }, '_id');
        break;
      case 'Department':
        const deptEmployees = await Employee.find({ 'workInfo.department': department }).populate('user');
        recipients = deptEmployees.map(emp => ({ _id: emp.user._id }));
        break;
    }

    if (recipients.length > 0) {
      await NotificationService.sendAnnouncementNotification(
        announcement,
        recipients.map(r => r._id)
      );
    }

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update announcement (Admin/HR only)
router.put('/:id', authMiddleware, roleAuth('admin', 'hr'), announcementValidation, validate, async (req, res) => {
  try {
    const { title, content, type, priority, targetAudience, department, expiryDate, isActive } = req.body;

    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    // Update fields
    announcement.title = title;
    announcement.content = content;
    announcement.type = type;
    announcement.priority = priority;
    announcement.targetAudience = targetAudience;
    announcement.department = department;
    announcement.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (typeof isActive !== 'undefined') announcement.isActive = isActive;

    await announcement.save();
    await announcement.populate('createdBy', 'username email');

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete announcement (Admin/HR only)
router.delete('/:id', authMiddleware, roleAuth('admin', 'hr'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    // Soft delete
    announcement.isActive = false;
    await announcement.save();

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark announcement as read
router.post('/:id/read', authMiddleware, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    // Check if already read
    const alreadyRead = announcement.readBy.some(
      read => read.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      announcement.readBy.push({
        user: req.user._id,
        readAt: new Date()
      });
      await announcement.save();
    }

    res.json({
      success: true,
      message: 'Announcement marked as read'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get announcement statistics (Admin/HR only)
router.get('/statistics', authMiddleware, roleAuth('admin', 'hr'), async (req, res) => {
  try {
    const totalAnnouncements = await Announcement.countDocuments({ isActive: true });
    const activeAnnouncements = await Announcement.countDocuments({ 
      isActive: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } }
      ]
    });

    const typeStats = await Announcement.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const priorityStats = await Announcement.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalAnnouncements,
        activeAnnouncements,
        typeStats,
        priorityStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;