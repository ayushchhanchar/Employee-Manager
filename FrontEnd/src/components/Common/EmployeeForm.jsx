import React, { useEffect, useState } from 'react';
import { employeeAPI } from '../../services/api';

const defaultData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
  },
  workInfo: {
    department: '',
    designation: '',
    joiningDate: '',
    employmentType: 'Full-time',
  },
  createUser: true,
};

const EmployeeForm = ({ employee, onClose, onRefresh }) => {
  const [form, setForm] = useState(defaultData);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(employee);

  useEffect(() => {
    if (employee) {
      setForm({
        personalInfo: {
          ...employee.personalInfo,
          dateOfBirth: employee.personalInfo.dateOfBirth
            ? employee.personalInfo.dateOfBirth.split('T')[0]
            : '',
        },
        workInfo: {
          ...employee.workInfo,
          joiningDate: employee.workInfo.joiningDate
            ? employee.workInfo.joiningDate.split('T')[0]
            : '',
        },
        createUser: false,
      });
    }
  }, [employee]);

  const handleChange = (section, key, value) => {
    setForm({
      ...form,
      [section]: { ...form[section], [key]: value },
    });
  };

  const isValidDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { personalInfo, workInfo } = form;

    if (
      !personalInfo.firstName ||
      !personalInfo.lastName ||
      !personalInfo.email ||
      !personalInfo.phone ||
      !workInfo.department ||
      !workInfo.designation ||
      !workInfo.joiningDate
    ) {
      alert('Please fill all required fields');
      return;
    }

    // Validate joiningDate
    if (!isValidDate(workInfo.joiningDate)) {
      alert('Please enter a valid joining date');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        workInfo: {
          ...form.workInfo,
          joiningDate: new Date(form.workInfo.joiningDate).toISOString().split('T')[0],
        },
        personalInfo: {
          ...form.personalInfo,
          dateOfBirth: form.personalInfo.dateOfBirth
            ? new Date(form.personalInfo.dateOfBirth).toISOString().split('T')[0]
            : '',
        },
      };

      if (isEdit) {
        await employeeAPI.update(employee._id, payload);
      } else {
        await employeeAPI.create(payload);
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 h-full rounded shadow w-full max-w-4xl relative">
      <h3 className="text-2xl font-semibold mb-6 text-center text-gray-100">
        {isEdit ? 'Edit Employee' : 'Add New Employee'}
      </h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Personal Info Section */}
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-300">First Name</label>
          <input
            type="text"
            required
            value={form.personalInfo.firstName}
            onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
            className="input"
            placeholder="First Name"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-300">Last Name</label>
          <input
            type="text"
            required
            value={form.personalInfo.lastName}
            onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
            className="input"
            placeholder="Last Name"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-300">Email</label>
          <input
            type="email"
            required
            value={form.personalInfo.email}
            onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
            className="input"
            placeholder="Email"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-300">Phone</label>
          <input
            type="tel"
            required
            value={form.personalInfo.phone}
            onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
            className="input"
            placeholder="Phone Number"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-300">Date of Birth</label>
          <input
            type="date"
            value={form.personalInfo.dateOfBirth}
            onChange={(e) => handleChange('personalInfo', 'dateOfBirth', e.target.value)}
            className="input"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-300">Gender</label>
          <select
            value={form.personalInfo.gender}
            onChange={(e) => handleChange('personalInfo', 'gender', e.target.value)}
            className="input"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Work Info Section */}
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-300">Department</label>
          <select
            required
            value={form.workInfo.department}
            onChange={(e) => handleChange('workInfo', 'department', e.target.value)}
            className="input"
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Support">Support</option>
            <option value="Design">Design</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-300">Designation</label>
          <input
            type="text"
            required
            value={form.workInfo.designation}
            onChange={(e) => handleChange('workInfo', 'designation', e.target.value)}
            className="input"
            placeholder="Designation"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-300">Joining Date</label>
          <input
            type="date"
            required
            value={form.workInfo.joiningDate}
            onChange={(e) => handleChange('workInfo', 'joiningDate', e.target.value)}
            className="input"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1 text-gray-300">Employment Type</label>
          <select
            value={form.workInfo.employmentType}
            onChange={(e) => handleChange('workInfo', 'employmentType', e.target.value)}
            className="input"
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Intern</option>
          </select>
        </div>

        {/* Create user toggle (only for new employee) */}
        {!isEdit && (
          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={form.createUser}
                onChange={(e) => setForm({ ...form, createUser: e.target.checked })}
                className="mr-2 bg-gray-700 border-gray-600"
              />
              <span className="text-sm text-gray-300">Also create user account and send credentials</span>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <div className="col-span-2 mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : isEdit ? 'Update Employee' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;