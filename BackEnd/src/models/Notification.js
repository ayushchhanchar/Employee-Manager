const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Leave', 'Attendance', 'Announcement', 'System', 'Reminder'], 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  data: { type: mongoose.Schema.Types.Mixed }, // Additional data related to notification
  createdAt: { type: Date, default: Date.now }
});

NotificationSchema.pre('save', function(next) {
  if (this.isRead && !this.readAt) {
    this.readAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Notification', NotificationSchema);