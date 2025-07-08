const Notification = require('../models/Notification');

class NotificationService {
  // Create notification
  static async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get user notifications
  static async getUserNotifications(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const notifications = await Notification.find({ recipient: userId })
        .populate('sender', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments({ recipient: userId });
      const unreadCount = await Notification.countDocuments({ 
        recipient: userId, 
        isRead: false 
      });

      return {
        notifications,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          hasNext: skip + notifications.length < total,
          hasPrev: page > 1
        },
        unreadCount
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId, userId) {
    try {
      await Notification.findOneAndDelete({ 
        _id: notificationId, 
        recipient: userId 
      });
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Send leave notification
  static async sendLeaveNotification(leaveData, type) {
    const notifications = [];
    
    try {
      switch (type) {
        case 'applied':
          // Notify HR/Admin about new leave application
          notifications.push({
            recipient: leaveData.hrUserId, // You'll need to get HR user ID
            sender: leaveData.employee.user,
            title: 'New Leave Application',
            message: `${leaveData.employee.personalInfo.firstName} ${leaveData.employee.personalInfo.lastName} has applied for ${leaveData.leaveType} leave from ${new Date(leaveData.startDate).toLocaleDateString()} to ${new Date(leaveData.endDate).toLocaleDateString()}`,
            type: 'Leave',
            priority: 'Medium',
            data: { leaveId: leaveData._id, action: 'applied' }
          });
          break;

        case 'approved':
        case 'rejected':
          // Notify employee about leave status update
          notifications.push({
            recipient: leaveData.employee.user,
            sender: leaveData.approvedBy,
            title: `Leave Request ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            message: `Your ${leaveData.leaveType} leave request from ${new Date(leaveData.startDate).toLocaleDateString()} to ${new Date(leaveData.endDate).toLocaleDateString()} has been ${type}`,
            type: 'Leave',
            priority: 'High',
            data: { leaveId: leaveData._id, action: type }
          });
          break;
      }

      // Create all notifications
      for (const notificationData of notifications) {
        await this.createNotification(notificationData);
      }

      return true;
    } catch (error) {
      console.error('Error sending leave notifications:', error);
      throw error;
    }
  }

  // Send announcement notification
  static async sendAnnouncementNotification(announcement, recipients) {
    try {
      const notifications = recipients.map(userId => ({
        recipient: userId,
        sender: announcement.createdBy,
        title: `New Announcement: ${announcement.title}`,
        message: announcement.content.substring(0, 100) + (announcement.content.length > 100 ? '...' : ''),
        type: 'Announcement',
        priority: announcement.priority,
        data: { announcementId: announcement._id }
      }));

      // Create all notifications
      for (const notificationData of notifications) {
        await this.createNotification(notificationData);
      }

      return true;
    } catch (error) {
      console.error('Error sending announcement notifications:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;