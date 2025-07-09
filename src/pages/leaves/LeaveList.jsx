import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, Statistic, Row, Col, Select, DatePicker, message } from 'antd';
import { PlusOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import Layout from '../../components/Layout/Layout';
import { leaveAPI } from '../../services/api';
import { userRoleSelector } from '../../store/authStore';

const { Option } = Select;
const { RangePicker } = DatePicker;

const LeaveList = () => {
  const navigate = useNavigate();
  const userRole = useRecoilValue(userRoleSelector);
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    dateRange: null
  });

  useEffect(() => {
    fetchLeaves();
    fetchLeaveBalance();
  }, [filters]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        startDate: filters.dateRange?.[0]?.toISOString(),
        endDate: filters.dateRange?.[1]?.toISOString()
      };
      
      const response = await leaveAPI.getAll(params);
      setLeaves(response.data.data);
    } catch (error) {
      message.error('Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const response = await leaveAPI.getBalance();
      setBalance(response.data.data);
    } catch (error) {
      console.error('Failed to fetch leave balance:', error);
    }
  };

  const handleStatusUpdate = async (id, status, rejectionReason = '') => {
    try {
      await leaveAPI.updateStatus(id, { status, rejectionReason });
      message.success(`Leave ${status.toLowerCase()} successfully`);
      fetchLeaves();
    } catch (error) {
      message.error('Failed to update leave status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'green';
      case 'Rejected': return 'red';
      case 'Pending': return 'orange';
      case 'Cancelled': return 'gray';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_, record) => (
        <div>
          <div className="font-medium">
            {record.employee?.personalInfo?.firstName} {record.employee?.personalInfo?.lastName}
          </div>
          <div className="text-gray-500 text-sm">{record.employee?.employeeId}</div>
        </div>
      )
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => (
        <div>
          <div>{dayjs(record.startDate).format('MMM DD')} - {dayjs(record.endDate).format('MMM DD, YYYY')}</div>
          <div className="text-gray-500 text-sm">{record.totalDays} days</div>
        </div>
      )
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: 'Applied Date',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
      render: (date) => dayjs(date).format('MMM DD, YYYY')
    }
  ];

  // Add actions column for admin/hr
  if (['admin', 'hr'].includes(userRole)) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        record.status === 'Pending' && (
          <Space>
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleStatusUpdate(record._id, 'Approved')}
            >
              Approve
            </Button>
            <Button 
              danger 
              size="small"
              onClick={() => handleStatusUpdate(record._id, 'Rejected', 'Rejected by admin')}
            >
              Reject
            </Button>
          </Space>
        )
      )
    });
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600">Manage leave requests and balance</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/leaves/apply')}
          >
            Apply Leave
          </Button>
        </div>

        {/* Leave Balance Cards */}
        {balance && (
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Annual Leave"
                  value={balance.leaveTypes?.Annual?.remaining || 0}
                  suffix={`/ ${balance.leaveTypes?.Annual?.total || 0}`}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Sick Leave"
                  value={balance.leaveTypes?.Sick?.remaining || 0}
                  suffix={`/ ${balance.leaveTypes?.Sick?.total || 0}`}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Casual Leave"
                  value={balance.leaveTypes?.Casual?.remaining || 0}
                  suffix={`/ ${balance.leaveTypes?.Casual?.total || 0}`}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Used"
                  value={balance.totalUsed || 0}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Filters and Table */}
        <Card>
          <div className="flex items-center space-x-4 mb-6">
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>

            <Select
              placeholder="Leave Type"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setFilters(prev => ({ ...prev, leaveType: value }))}
            >
              <Option value="Annual">Annual</Option>
              <Option value="Sick">Sick</Option>
              <Option value="Casual">Casual</Option>
              <Option value="Maternity">Maternity</Option>
              <Option value="Paternity">Paternity</Option>
              <Option value="Emergency">Emergency</Option>
            </Select>

            <RangePicker
              onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
            />
          </div>

          <Table
            columns={columns}
            dataSource={leaves}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default LeaveList;