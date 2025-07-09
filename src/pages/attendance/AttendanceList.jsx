import React, { useState, useEffect } from 'react';
import { Table, Card, Select, DatePicker, Button, Tag, message, Space } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Layout from '../../components/Layout/Layout';
import { attendanceAPI, employeeAPI } from '../../services/api';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    employeeId: '',
    status: '',
    dateRange: null
  });

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, [filters]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        startDate: filters.dateRange?.[0]?.toISOString(),
        endDate: filters.dateRange?.[1]?.toISOString()
      };
      
      const response = await attendanceAPI.getAll(params);
      setAttendance(response.data.data);
    } catch (error) {
      message.error('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'green';
      case 'Absent': return 'red';
      case 'Late': return 'orange';
      case 'Half Day': return 'blue';
      case 'Holiday': return 'purple';
      case 'Leave': return 'yellow';
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMM DD, YYYY')
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (time) => time ? dayjs(time).format('HH:mm:ss') : '-'
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
      render: (time) => time ? dayjs(time).format('HH:mm:ss') : '-'
    },
    {
      title: 'Total Hours',
      dataIndex: 'totalHours',
      key: 'totalHours',
      render: (hours) => hours ? `${hours.toFixed(2)}h` : '-'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
            <p className="text-gray-600">Monitor employee attendance and working hours</p>
          </div>
          <Button icon={<DownloadOutlined />}>
            Export Report
          </Button>
        </div>

        <Card>
          <div className="flex items-center space-x-4 mb-6">
            <Select
              placeholder="Select Employee"
              allowClear
              style={{ width: 200 }}
              onChange={(value) => setFilters(prev => ({ ...prev, employeeId: value }))}
            >
              {employees.map(emp => (
                <Option key={emp._id} value={emp._id}>
                  {emp.personalInfo.firstName} {emp.personalInfo.lastName}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Status"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Option value="Present">Present</Option>
              <Option value="Absent">Absent</Option>
              <Option value="Late">Late</Option>
              <Option value="Half Day">Half Day</Option>
              <Option value="Holiday">Holiday</Option>
              <Option value="Leave">Leave</Option>
            </Select>

            <RangePicker
              onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
            />
          </div>

          <Table
            columns={columns}
            dataSource={attendance}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default AttendanceList;