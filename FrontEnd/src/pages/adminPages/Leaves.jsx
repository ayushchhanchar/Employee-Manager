import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { leaveState, leaveFiltersState } from '../../store/leaveStore';
import { leaveAPI } from '../../services/api';
import Layout from '../../components/Layout/Layout';
import Sidebar from '../../components/Layout/Sidebar';

const Leaves = () => {
  const [leaveData, setLeaveData] = useRecoilState(leaveState);
  const [filters, setFilters] = useRecoilState(leaveFiltersState);
  const [form, setForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    teamEmail: '',
    handoverNotes: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const role = currentUser?.role;
  const isAdminOrHR = role === 'admin' || role === 'hr';

  useEffect(() => {
    fetchLeaves();
    if (!isAdminOrHR) fetchBalance();
  }, [filters]);

  const fetchLeaves = async () => {
    setLeaveData(prev => ({ ...prev, loading: true }));
    try {
      const res = await leaveAPI.getAll(filters);
      setLeaveData(prev => ({ ...prev, leaves: res.data.data, loading: false }));
    } catch (err) {
      setLeaveData(prev => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await leaveAPI.getBalance();
      setLeaveData(prev => ({ ...prev, balance: res.data.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await leaveAPI.apply(form);
      alert('Leave applied successfully!');
      fetchLeaves();
      fetchBalance();
      setForm({
        leaveType: '', startDate: '', endDate: '',
        reason: '', teamEmail: '', handoverNotes: ''
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying leave');
    }
  };

  const handleStatusChange = async (id, status, rejectionReason = '') => {
    try {
      await leaveAPI.updateStatus(id, { status, rejectionReason });
      alert(`Leave ${status.toLowerCase()} successfully`);
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <Layout>
      <Sidebar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">🗂️ Leave Dashboard ({role})</h1>

        {/* User View */}
        {!isAdminOrHR && (
          <>
            {/* Leave Balance */}
            {leaveData.balance && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {Object.entries(leaveData.balance.leaveTypes).map(([type, data]) => (
                  <div key={type} className="bg-white p-4 rounded shadow">
                    <h3 className="font-medium">{type}</h3>
                    <p className="text-sm">Used: {data.used} / {data.total}</p>
                    <p className="text-green-600 text-sm">Remaining: {data.remaining}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Apply Form */}
            <form onSubmit={handleApplyLeave} className="bg-white p-6 rounded shadow mb-6">
              <h2 className="text-lg font-semibold mb-4">Apply for Leave</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <select required value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })} className="border p-2 rounded">
                  <option value="">Leave Type</option>
                  {['Annual', 'Sick', 'Maternity', 'Paternity', 'Emergency', 'Casual'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="border p-2 rounded" />
                <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="border p-2 rounded" />
                <input type="email" placeholder="Team Email (optional)" value={form.teamEmail} onChange={(e) => setForm({ ...form, teamEmail: e.target.value })} className="border p-2 rounded" />
              </div>
              <textarea required placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full mt-3 border p-2 rounded"></textarea>
              <textarea placeholder="Handover Notes (optional)" value={form.handoverNotes} onChange={(e) => setForm({ ...form, handoverNotes: e.target.value })} className="w-full mt-2 border p-2 rounded"></textarea>
              <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Submit</button>
            </form>
          </>
        )}

        {/* Leaves List */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">{isAdminOrHR ? 'All Leave Requests' : 'Your Leave Requests'}</h2>
          {leaveData.leaves.length > 0 ? (
            <div className="space-y-4">
              {leaveData.leaves.map((leave) => (
                <div key={leave._id} className="border p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{leave.leaveType}</p>
                      <p className="text-sm text-gray-600">{leave.startDate.split('T')[0]} → {leave.endDate.split('T')[0]}</p>
                      <p className="text-sm">Reason: {leave.reason}</p>
                      {isAdminOrHR && (
                        <p className="text-sm text-gray-600">
                          👤 {leave.employee?.personalInfo?.firstName} {leave.employee?.personalInfo?.lastName}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded text-sm ${leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {leave.status}
                      </span>
                      {isAdminOrHR && leave.status === 'Pending' && (
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => handleStatusChange(leave._id, 'Approved')} className="text-green-600 border border-green-500 px-2 py-1 text-sm rounded">Approve</button>
                          <button onClick={() => handleStatusChange(leave._id, 'Rejected', prompt('Rejection Reason'))} className="text-red-600 border border-red-500 px-2 py-1 text-sm rounded">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No leave requests found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Leaves;
