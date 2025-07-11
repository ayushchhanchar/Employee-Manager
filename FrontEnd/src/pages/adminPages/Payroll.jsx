import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { payrollAPI } from '../../services/api';
import { payrollFiltersState, payrollState } from '../../store/payrollStore';
import Layout from '../../components/Layout/Layout';
import Sidebar from '../../components/Layout/Sidebar';

const Payroll = () => {
  const [filters, setFilters] = useRecoilState(payrollFiltersState);
  const [state, setState] = useRecoilState(payrollState);
  const { list, summary, pagination, loading, error } = state;

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const res = await payrollAPI.getAll({
        year: filters.year,
        month: filters.month,
        status: filters.status,
        employeeId: filters.employeeId,
        page: filters.page,
        limit: filters.limit,
      });
      setState({
        ...state,
        list: res.data.data,
        pagination: res.data.pagination,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <Layout>
      <Sidebar />
      <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
        <h2 className="text-2xl font-bold mb-4">Payroll Management</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="number"
            min="2000"
            max="2099"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: +e.target.value })}
            className="bg-gray-800 border border-gray-600 text-gray-100 px-3 py-2 rounded"
            placeholder="Year"
          />
          <input
            type="number"
            min="1"
            max="12"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: +e.target.value })}
            className="bg-gray-800 border border-gray-600 text-gray-100 px-3 py-2 rounded"
            placeholder="Month"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="bg-gray-800 border border-gray-600 text-gray-100 px-3 py-2 rounded"
          >
            <option value="">Any Status</option>
            <option value="Draft">Draft</option>
            <option value="Processed">Processed</option>
            <option value="Paid">Paid</option>
          </select>
          <button
            onClick={() => fetchData()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Filter
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading payroll records...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <>
            <div className="overflow-auto rounded shadow">
              <table className="min-w-full bg-gray-800 text-gray-100">
                <thead>
                  <tr className="bg-gray-700 text-left">
                    <th className="px-4 py-2">Employee ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Period</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Gross</th>
                    <th className="px-4 py-2">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {list
                    .filter(p => p && p.employee)
                    .map((p) => (
                      <tr key={p._id} className="border-t border-gray-700">
                        <td className="px-4 py-2">{p.employee?.employeeId || 'N/A'}</td>
                        <td className="px-4 py-2">
                          {p.employee?.personalInfo?.firstName || ''}{' '}
                          {p.employee?.personalInfo?.lastName || ''}
                        </td>
                        <td className="px-4 py-2">{p.payPeriod?.month}/{p.payPeriod?.year}</td>
                        <td className="px-4 py-2">{p.status || 'N/A'}</td>
                        <td className="px-4 py-2">{p.totalEarnings?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-2">{p.netSalary?.toFixed(2) || '0.00'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.total > filters.limit && (
              <div className="flex justify-between items-center mt-4 text-sm">
                <button
                  disabled={!pagination.hasPrev}
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  className="px-3 py-1 border border-gray-600 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {pagination.current} of {pagination.total}
                </span>
                <button
                  disabled={!pagination.hasNext}
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  className="px-3 py-1 border border-gray-600 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Summary */}
        <div className="mt-8 bg-gray-800 p-4 shadow rounded">
          <h3 className="font-semibold mb-2 text-lg">Summary for {filters.year}</h3>
          {summary ? (
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <li>Total Pay Records: {summary.totalPayrolls}</li>
              <li>Total Earning: ₹{summary.totalEarnings?.toFixed(2) || '0.00'}</li>
              <li>Total Deductions: ₹{summary.totalDeductions?.toFixed(2) || '0.00'}</li>
              <li>Net Salary: ₹{summary.totalNetSalary?.toFixed(2) || '0.00'}</li>
              <li>Drafts: {summary.statusBreakdown?.Draft || 0}</li>
              <li>Processed: {summary.statusBreakdown?.Processed || 0}</li>
              <li>Paid: {summary.statusBreakdown?.Paid || 0}</li>
            </ul>
          ) : (
            <p className="text-gray-400">No summary data available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Payroll;
