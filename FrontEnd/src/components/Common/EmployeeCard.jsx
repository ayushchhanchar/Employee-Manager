import React, { useState } from 'react';
import { employeeAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const statusOptions = ['Active', 'Inactive', 'Terminated'];

const EmployeeCard = ({ employee, onRefresh }) => {
  const [status, setStatus] = useState(employee.status);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);
    
    try {
      // Update the employee with the new status
      await employeeAPI.update(employee._id, {
        personalInfo: employee.personalInfo,
        workInfo: employee.workInfo,
        status: newStatus,
      });
      
      setStatus(newStatus);
      toast.success(`Status updated to ${newStatus}`);
      onRefresh();
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
      // Revert the status if update failed
      setStatus(employee.status);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async () => {
    if (!window.confirm('Are you sure you want to terminate this employee?')) return;
    
    setLoading(true);
    try {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'Inactive':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Terminated':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
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
        <p><span className="font-medium">Type:</span> {employee.workInfo.employmentType}</p>
      </div>

      {/* Status Display */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      {/* Status & Actions */}
      <div className="flex justify-between items-center border-t pt-4 mt-2">
        <div className="flex-1 mr-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">Change Status:</label>
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
          className={`text-sm font-medium px-4 py-2 rounded transition-colors duration-200 ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {loading ? 'Processing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;