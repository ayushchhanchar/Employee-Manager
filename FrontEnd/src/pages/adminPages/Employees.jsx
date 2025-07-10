import React, { useEffect, useState } from 'react';
import { employeeAPI } from '../../services/api';
import EmployeeForm from '../../components/Common/EmployeeForm';
import EmployeeCard from '../../components/Common/EmployeeCard';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import Sidebar from '../../components/Layout/Sidebar';
import Layout from '../../components/Layout/Layout';
import { toast } from 'react-hot-toast';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ search: '', department: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeAPI.getAll(filters);
      setEmployees(res.data.data || []);
      setPagination(res.data.pagination || {
        current: 1,
        total: 1,
        hasNext: false,
        hasPrev: false
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch employees');
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', department: '', status: '' });
  };

  const openCreateForm = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedEmployee(null);
  };

  return (
    <Layout>
      <Sidebar />
      <div className="px-6 py-6 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">👩‍💼 Employee Management</h2>
            <p className="text-gray-600 mt-1">Manage your organization's workforce</p>
          </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition duration-200 shadow-lg"
            onClick={openCreateForm}
          >
            <FaPlus className="text-sm" /> Add Employee
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
            <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Active</h3>
            <p className="text-2xl font-bold text-green-600">
              {employees.filter(emp => emp.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Inactive</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {employees.filter(emp => emp.status === 'Inactive').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Terminated</h3>
            <p className="text-2xl font-bold text-red-600">
              {employees.filter(emp => emp.status === 'Terminated').length}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-lg shadow border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search name or email"
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <FaSearch className="absolute top-3 left-3 text-gray-400" />
            </div>

            {/* Department Dropdown */}
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Design">Design</option>
              <option value="Support">Support</option>
            </select>

            {/* Status Dropdown */}
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Terminated">Terminated</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-3 py-2 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Employee Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading employees...</span>
          </div>
        ) : employees.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {employees.map((emp) => (
                <EmployeeCard
                  key={emp._id}
                  employee={emp}
                  onEdit={() => handleEdit(emp)}
                  onRefresh={fetchEmployees}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={() => handleFilterChange('page', pagination.current - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {pagination.current} of {pagination.total}
                </span>
                <button
                  onClick={() => handleFilterChange('page', pagination.current + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-500 mb-6">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters or search terms'
                : 'Get started by adding your first employee'
              }
            </p>
            <button
              onClick={openCreateForm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
            >
              Add First Employee
            </button>
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h3>
                <button
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  onClick={closeForm}
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <EmployeeForm
                  employee={selectedEmployee}
                  onClose={closeForm}
                  onRefresh={fetchEmployees}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Employees;