import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Tag, Avatar, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import Layout from '../../components/Layout/Layout';
import { employeeAPI } from '../../services/api';

const { Search } = Input;
const { Option } = Select;

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      };
      
      const response = await employeeAPI.getAll(params);
      const { data, pagination: paginationData } = response.data;
      
      setEmployees(data);
      setPagination(prev => ({
        ...prev,
        total: paginationData.total * pagination.pageSize
      }));
    } catch (error) {
      message.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this employee?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await employeeAPI.delete(id);
          message.success('Employee deleted successfully');
          fetchEmployees();
        } catch (error) {
          message.error('Failed to delete employee');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            src={record.personalInfo.profilePicture} 
            icon={<UserOutlined />}
            size="large"
          />
          <div>
            <div className="font-medium">
              {record.personalInfo.firstName} {record.personalInfo.lastName}
            </div>
            <div className="text-gray-500 text-sm">{record.employeeId}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div>{record.personalInfo.email}</div>
          <div className="text-gray-500 text-sm">{record.personalInfo.phone}</div>
        </div>
      )
    },
    {
      title: 'Department',
      dataIndex: ['workInfo', 'department'],
      key: 'department'
    },
    {
      title: 'Designation',
      dataIndex: ['workInfo', 'designation'],
      key: 'designation'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Inactive' ? 'orange' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Joining Date',
      dataIndex: ['workInfo', 'joiningDate'],
      key: 'joiningDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => window.location.href = `/employees/${record._id}`}
          >
            Edit
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  const handleTableChange = (paginationData) => {
    setPagination(paginationData);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-600">Manage your organization's employees</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={() => window.location.href = '/employees/new'}
          >
            Add Employee
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4 mb-6">
            <Search
              placeholder="Search employees..."
              allowClear
              style={{ width: 300 }}
              onSearch={(value) => setFilters(prev => ({ ...prev, search: value }))}
            />
            <Select
              placeholder="Department"
              allowClear
              style={{ width: 200 }}
              onChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
            >
              <Option value="IT">IT</Option>
              <Option value="HR">HR</Option>
              <Option value="Finance">Finance</Option>
              <Option value="Marketing">Marketing</Option>
            </Select>
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
              <Option value="Terminated">Terminated</Option>
            </Select>
          </div>

          <Table
            columns={columns}
            dataSource={employees}
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            rowKey="_id"
          />
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeList;