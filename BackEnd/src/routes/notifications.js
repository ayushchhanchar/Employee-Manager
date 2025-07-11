const express = require('express');
const authMiddleware = require('../middleware/auth');
const NotificationService = require('../services/notificationService');
const router = express.Router();

// Get user notifications (with filters)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      priority,
      unreadOnly
    } = req.query;

    const filters = { type, priority, unreadOnly };

    const result = await NotificationService.getUserNotifications(
      req.user._id,
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.json({
      success: true,
      data: result.notifications,
      pagination: result.pagination,
      unreadCount: result.unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await NotificationService.markAsRead(req.params.id, req.user._id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    await NotificationService.markAllAsRead(req.user._id);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await NotificationService.deleteNotification(req.params.id, req.user._id);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get unread count
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const result = await NotificationService.getUserNotifications(req.user._id, 1, 1);

    res.json({
      success: true,
      data: { unreadCount: result.unreadCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
