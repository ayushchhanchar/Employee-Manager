const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ['National', 'Regional', 'Company', 'Optional'], 
    default: 'Company' 
  },
  description: { type: String },
  isRecurring: { type: Boolean, default: false },
  applicableFor: { 
    type: String, 
    enum: ['All', 'Department', 'Location'], 
    default: 'All' 
  },
  department: { type: String }, // If applicableFor is 'Department'
  location: { type: String }, // If applicableFor is 'Location'
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

HolidaySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Holiday', HolidaySchema);