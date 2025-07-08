const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['General', 'Important', 'Urgent', 'Holiday', 'Event'], 
    default: 'General' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  targetAudience: { 
    type: String, 
    enum: ['All', 'Employees', 'Managers', 'HR', 'Department'], 
    default: 'All' 
  },
  department: { type: String }, // If targetAudience is 'Department'
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date },
  attachments: [{ type: String }], // File URLs
  readBy: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

AnnouncementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);