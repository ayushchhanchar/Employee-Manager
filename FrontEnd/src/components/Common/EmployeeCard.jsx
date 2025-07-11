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
        return 'text-green-300 bg-green-900/20 border-green-700/30';
      case 'Inactive':
        return 'text-yellow-300 bg-yellow-900/20 border-yellow-700/30';
      case 'Terminated':
        return 'text-red-300 bg-red-900/20 border-red-700/30';
      default:
        return 'text-gray-300 bg-gray-700/20 border-gray-600/30';
    }
  };

  return (
    <div className="bg-gray-800 shadow-lg border border-gray-700 rounded-lg p-6 transition-transform hover:scale-[1.01] duration-200">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-100">
            {employee.personalInfo.firstName} {employee.personalInfo.lastName}
          </h2>
          <p className="text-gray-400 text-sm">{employee.personalInfo.email}</p>
          <p className="text-gray-500 text-sm">{employee.personalInfo.phone}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-gray-400 bg-gray-700 px-3 py-1 rounded">
            #{employee.employeeId}
          </span>
        </div>
      </div>

      {/* Work Info */}
      <div className="text-sm text-gray-300 mb-4">
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
      <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-2">
        <div className="flex-1 mr-4">
          <label className="text-sm font-medium text-gray-300 block mb-1">Change Status:</label>
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={loading}
            className="w-full border border-gray-600 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 text-gray-100"
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
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {loading ? 'Processing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;