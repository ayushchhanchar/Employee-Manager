const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  totalHours: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Half Day', 'Late', 'Holiday', 'Leave'], 
    default: 'Absent' 
  },
  notes: { type: String },
  location: {
    checkInLocation: { type: String },
    checkOutLocation: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure one attendance record per employee per day
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Calculate total hours before saving
AttendanceSchema.pre('save', function(next) {
  if (this.checkIn && this.checkOut) {
    const diffMs = this.checkOut - this.checkIn;
    this.totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Attendance', AttendanceSchema);