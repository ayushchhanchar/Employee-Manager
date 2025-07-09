import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Select, DatePicker, Upload, message, Tabs, Avatar } from 'antd';
import { ArrowLeftOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Layout from '../../components/Layout/Layout';
import { employeeAPI } from '../../services/api';

const { Option } = Select;
const { TabPane } = Tabs;

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(null);
  const isNew = id === 'new';

  useEffect(() => {
    if (!isNew) {
      fetchEmployee();
    }
  }, [id, isNew]);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getById(id);
      const employeeData = response.data.data;
      setEmployee(employeeData);
      
      // Set form values
      form.setFieldsValue({
        ...employeeData.personalInfo,
        ...employeeData.workInfo,
        joiningDate: employeeData.workInfo.joiningDate ? dayjs(employeeData.workInfo.joiningDate) : null,
        dateOfBirth: employeeData.personalInfo.dateOfBirth ? dayjs(employeeData.personalInfo.dateOfBirth) : null
      });
    } catch (error) {
      message.error('Failed to fetch employee details');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        personalInfo: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          dateOfBirth: values.dateOfBirth?.toISOString(),
          gender: values.gender,
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            country: values.country
          }
        },
        workInfo: {
          department: values.department,
          designation: values.designation,
          joiningDate: values.joiningDate?.toISOString(),
          employmentType: values.employmentType,
          workLocation: values.workLocation,
          salary: {
            basic: values.basicSalary || 0,
            allowances: values.allowances || 0,
            deductions: values.deductions || 0
          }
        }
      };

      if (isNew) {
        await employeeAPI.create(payload);
        message.success('Employee created successfully');
      } else {
        await employeeAPI.update(id, payload);
        message.success('Employee updated successfully');
      }
      
      navigate('/employees');
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/employees')}
          >
            Back to Employees
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Add New Employee' : 'Edit Employee'}
            </h1>
            <p className="text-gray-600">
              {isNew ? 'Create a new employee profile' : 'Update employee information'}
            </p>
          </div>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
          >
            <Tabs defaultActiveKey="personal">
              <TabPane tab="Personal Information" key="personal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter first name' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter last name' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter email' },
                      { type: 'email', message: 'Please enter valid email' }
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item name="dateOfBirth" label="Date of Birth">
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item name="gender" label="Gender">
                    <Select>
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item name="street" label="Street">
                      <Input />
                    </Form.Item>

                    <Form.Item name="city" label="City">
                      <Input />
                    </Form.Item>

                    <Form.Item name="state" label="State">
                      <Input />
                    </Form.Item>

                    <Form.Item name="zipCode" label="Zip Code">
                      <Input />
                    </Form.Item>

                    <Form.Item name="country" label="Country">
                      <Input />
                    </Form.Item>
                  </div>
                </div>
              </TabPane>

              <TabPane tab="Work Information" key="work">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    name="department"
                    label="Department"
                    rules={[{ required: true, message: 'Please select department' }]}
                  >
                    <Select>
                      <Option value="IT">IT</Option>
                      <Option value="HR">HR</Option>
                      <Option value="Finance">Finance</Option>
                      <Option value="Marketing">Marketing</Option>
                      <Option value="Operations">Operations</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="designation"
                    label="Designation"
                    rules={[{ required: true, message: 'Please enter designation' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="joiningDate"
                    label="Joining Date"
                    rules={[{ required: true, message: 'Please select joining date' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item name="employmentType" label="Employment Type">
                    <Select>
                      <Option value="Full-time">Full-time</Option>
                      <Option value="Part-time">Part-time</Option>
                      <Option value="Contract">Contract</Option>
                      <Option value="Intern">Intern</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="workLocation" label="Work Location">
                    <Input />
                  </Form.Item>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Salary Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Form.Item name="basicSalary" label="Basic Salary">
                      <Input type="number" />
                    </Form.Item>

                    <Form.Item name="allowances" label="Allowances">
                      <Input type="number" />
                    </Form.Item>

                    <Form.Item name="deductions" label="Deductions">
                      <Input type="number" />
                    </Form.Item>
                  </div>
                </div>
              </TabPane>
            </Tabs>

            <div className="flex justify-end space-x-4 mt-8">
              <Button onClick={() => navigate('/employees')}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isNew ? 'Create Employee' : 'Update Employee'}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default EmployeeProfile;