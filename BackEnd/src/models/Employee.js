const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    profilePicture: { type: String, default: '' }
  },
  workInfo: {
    department: { type: String, required: true },
    designation: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Intern'], default: 'Full-time' },
    workLocation: { type: String, default: 'Office' },
    reportingManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    salary: {
      basic: { type: Number, default: 0 },
      allowances: { type: Number, default: 0 },
      deductions: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Terminated'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate employee ID before saving
// Generate unique employee ID before saving
EmployeeSchema.pre('save', async function (next) {
  try {
    if (!this.employeeId) {
      const lastEmployee = await mongoose
        .model('Employee')
        .findOne({})
        .sort({ createdAt: -1 }) // or sort({ employeeId: -1 }) if using numeric suffix
        .lean();

      let nextId = 1;

      if (lastEmployee && lastEmployee.employeeId) {
        const lastNumber = parseInt(lastEmployee.employeeId.replace('EMP', ''), 10);
        if (!isNaN(lastNumber)) nextId = lastNumber + 1;
      }

      this.employeeId = `EMP${String(nextId).padStart(4, '0')}`;
    }

    this.updatedAt = Date.now();
    next();
  } catch (err) {
    next(err);
  }
});



module.exports = mongoose.model('Employee', EmployeeSchema);