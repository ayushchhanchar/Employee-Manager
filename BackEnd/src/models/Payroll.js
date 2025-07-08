const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  payPeriod: {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true }
  },
  basicSalary: { type: Number, required: true },
  allowances: {
    hra: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  deductions: {
    tax: { type: Number, default: 0 },
    pf: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  overtime: {
    hours: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    amount: { type: Number, default: 0 }
  },
  bonus: { type: Number, default: 0 },
  totalEarnings: { type: Number, required: true },
  totalDeductions: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  workingDays: { type: Number, required: true },
  presentDays: { type: Number, required: true },
  leaveDays: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Draft', 'Processed', 'Paid'], 
    default: 'Draft' 
  },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  processedDate: { type: Date },
  paymentDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure one payroll record per employee per month
PayrollSchema.index({ employee: 1, 'payPeriod.month': 1, 'payPeriod.year': 1 }, { unique: true });

// Calculate totals before saving
PayrollSchema.pre('save', function(next) {
  // Calculate total allowances
  const totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + (val || 0), 0);
  
  // Calculate total deductions
  const totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + (val || 0), 0);
  
  // Calculate overtime amount
  this.overtime.amount = this.overtime.hours * this.overtime.rate;
  
  // Calculate totals
  this.totalEarnings = this.basicSalary + totalAllowances + this.overtime.amount + this.bonus;
  this.totalDeductions = totalDeductions;
  this.netSalary = this.totalEarnings - this.totalDeductions;
  
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Payroll', PayrollSchema);