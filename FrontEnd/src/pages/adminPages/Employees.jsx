import React, { useEffect, useState } from 'react';
import { employeeAPI } from '../../services/api';
import EmployeeForm from '../../components/Common/EmployeeForm';
import EmployeeCard from '../../components/Common/EmployeeCard';
import { FaPlus, FaSearch } from 'react-icons/fa';
import Sidebar from '../../components/Layout/Sidebar';
import Layout from '../../components/Layout/Layout';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ search: '', department: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeAPI.getAll(filters);
      setEmployees(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to terminate this employee?')) return;
    try {
      await employeeAPI.delete(id);
      fetchEmployees();
    } catch (err) {
      alert('Failed to delete employee');
    }
  };

  return (
    <Layout>
      <Sidebar />
      <div className="px-6 py-6 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">👩‍💼 Employee Management</h2>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition duration-200"
            onClick={() => {
              setSelectedEmployee(null);
              setShowForm(true);
            }}
          >
            <FaPlus className="text-sm" /> Add Employee
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search name or email"
              className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
          </div>

          {/* Department Dropdown */}
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            <option value="">All Departments</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="Design">Design</option>
            <option value="Operations">Operations</option>
          </select>

          {/* Status Dropdown */}
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Terminated">Terminated</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => setFilters({ search: '', department: '', status: '' })}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-3 py-2 transition"
          >
            Clear Filters
          </button>
        </div>

        {/* Employee Cards */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading employees...</div>
        ) : employees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {employees.map((emp) => (
              <EmployeeCard
                key={emp._id}
                employee={emp}
                onEdit={() => handleEdit(emp)}
                onDelete={() => handleDelete(emp._id)}
                onRefresh={fetchEmployees}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">No employees found.</div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative">
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
              <EmployeeForm
                employee={selectedEmployee}
                onClose={() => setShowForm(false)}
                onRefresh={fetchEmployees}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Employees;
