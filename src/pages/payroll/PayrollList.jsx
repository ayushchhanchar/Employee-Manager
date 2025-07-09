import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Select, Button, message, Statistic, Row, Col } from 'antd';
import { DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRecoilValue } from 'recoil';
import Layout from '../../components/Layout/Layout';
import { payrollAPI } from '../../services/api';
import { userRoleSelector } from '../../store/authStore';

const { Option } = Select;

const PayrollList = () => {
  const userRole = useRecoilValue(userRoleSelector);
  const [payrolls, setPayrolls] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: ''
  });

  useEffect(() => {
    fetchPayrolls();
    fetchSummary();
  }, [filters]);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const response = await payrollAPI.getAll(filters);
      setPayrolls(response.data.data);
    } catch (error) {
      message.error('Failed to fetch payroll data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await payrollAPI.getSummary({ year: filters.year });
      setSummary(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payroll summary:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'green';
      case 'Processed': return 'blue';
      case 'Draft': return 'orange';
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
      title: 'Pay Period',
      key: 'payPeriod',
      render: (_, record) => (
        `${record.payPeriod.month}/${record.payPeriod.year}`
      )
    },
    {
      title: 'Basic Salary',
      dataIndex: 'basicSalary',
      key: 'basicSalary',
      render: (amount) => `$${amount.toLocaleString()}`
    },
    {
      title: 'Total Earnings',
      dataIndex: 'totalEarnings',
      key: 'totalEarnings',
      render: (amount) => `$${amount.toLocaleString()}`
    },
    {
      title: 'Total Deductions',
      dataIndex: 'totalDeductions',
      key: 'totalDeductions',
      render: (amount) => `$${amount.toLocaleString()}`
    },
    {
      title: 'Net Salary',
      dataIndex: 'netSalary',
      key: 'netSalary',
      render: (amount) => (
        <span className="font-semibold text-green-600">
          ${amount.toLocaleString()}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    }
  ];

  // Add actions for admin/hr
  if (['admin', 'hr'].includes(userRole)) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="space-x-2">
          {record.status === 'Draft' && (
            <Button size="small" type="primary">
              Process
            </Button>
          )}
          {record.status === 'Processed' && (
            <Button size="small" type="primary">
              Mark as Paid
            </Button>
          )}
        </div>
      )
    });
  }

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <p className="text-gray-600">View salary information and payslips</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Payrolls"
                  value={summary.summary?.totalPayrolls || 0}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Earnings"
                  value={summary.summary?.totalEarnings || 0}
                  prefix={<DollarOutlined />}
                  precision={2}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Deductions"
                  value={summary.summary?.totalDeductions || 0}
                  prefix={<DollarOutlined />}
                  precision={2}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Net Salary"
                  value={summary.summary?.totalNetSalary || 0}
                  prefix={<DollarOutlined />}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Filters and Table */}
        <Card>
          <div className="flex items-center space-x-4 mb-6">
            <Select
              value={filters.month}
              style={{ width: 120 }}
              onChange={(value) => setFilters(prev => ({ ...prev, month: value }))}
            >
              {months.map(month => (
                <Option key={month.value} value={month.value}>
                  {month.label}
                </Option>
              ))}
            </Select>

            <Select
              value={filters.year}
              style={{ width: 100 }}
              onChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
            >
              {years.map(year => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Status"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Option value="Draft">Draft</Option>
              <Option value="Processed">Processed</Option>
              <Option value="Paid">Paid</Option>
            </Select>
          </div>

          <Table
            columns={columns}
            dataSource={payrolls}
            loading={loading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default PayrollList;