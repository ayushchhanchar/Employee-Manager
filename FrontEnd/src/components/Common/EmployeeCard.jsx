import React, { useState } from 'react';
import { employeeAPI } from '../../services/api';
import { toast } from 'react-toastify';

const statusOptions = ['Active', 'Inactive', 'Terminated'];

const EmployeeCard = ({ employee, onRefresh }) => {
  const [status, setStatus] = useState(employee.status);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await employeeAPI.update(employee._id, {
        personalInfo: employee.personalInfo,
        workInfo: employee.workInfo,
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus}`);
      onRefresh();
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  const handleTerminate = async () => {
    if (!window.confirm('Are you sure you want to terminate this employee?')) return;
    try {
      setLoading(true);
      await employeeAPI.remove(employee._id);
      toast.success('Employee terminated successfully');
      onRefresh();
    } catch (err) {
      toast.error('Failed to terminate employee');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 transition-transform hover:scale-[1.01] duration-200">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {employee.personalInfo.firstName} {employee.personalInfo.lastName}
          </h2>
          <p className="text-gray-600 text-sm">{employee.personalInfo.email}</p>
          <p className="text-gray-500 text-sm">{employee.personalInfo.phone}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded">
            #{employee.employeeId}
          </span>
        </div>
      </div>

      {/* Work Info */}
      <div className="text-sm text-gray-700 mb-4">
        <p><span className="font-medium">Department:</span> {employee.workInfo.department}</p>
        <p><span className="font-medium">Designation:</span> {employee.workInfo.designation}</p>
        <p><span className="font-medium">Joining:</span> {new Date(employee.workInfo.joiningDate).toLocaleDateString()}</p>
      </div>

      {/* Status & Actions */}
      <div className="flex justify-between items-center border-t pt-4 mt-2">
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleTerminate}
          disabled={loading}
          className={`text-sm font-medium px-3 py-1 rounded transition-colors duration-200 ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {loading ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
