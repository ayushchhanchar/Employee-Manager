import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, message, Tabs } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useRecoilValue } from 'recoil';
import Layout from '../components/Layout/Layout';
import { authState } from '../store/authStore';
import { employeeAPI } from '../services/api';

const { TabPane } = Tabs;

const Profile = () => {
  const auth = useRecoilValue(authState);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetchEmployeeProfile();
  }, []);

  const fetchEmployeeProfile = async () => {
    try {
      // Find employee by user ID
      const response = await employeeAPI.getAll({ userId: auth.user._id });
      if (response.data.data.length > 0) {
        const employeeData = response.data.data[0];
        setEmployee(employeeData);
        form.setFieldsValue({
          ...employeeData.personalInfo,
          username: auth.user.username,
          email: auth.user.email
        });
      }
    } catch (error) {
      console.error('Failed to fetch employee profile:', error);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (employee) {
        const payload = {
          personalInfo: {
            ...employee.personalInfo,
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone
          }
        };
        
        await employeeAPI.update(employee._id, payload);
        message.success('Profile updated successfully');
        fetchEmployeeProfile();
      }
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>

        <Card>
          <div className="flex items-center space-x-6 mb-8">
            <Avatar size={100} icon={<UserOutlined />} />
            <div>
              <h2 className="text-xl font-semibold">
                {employee?.personalInfo?.firstName} {employee?.personalInfo?.lastName}
              </h2>
              <p className="text-gray-600">{employee?.workInfo?.designation}</p>
              <p className="text-gray-500">{employee?.workInfo?.department}</p>
            </div>
          </div>

          <Tabs defaultActiveKey="personal">
            <TabPane tab="Personal Information" key="personal">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
              >
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
                    rules={[{ type: 'email', message: 'Please enter valid email' }]}
                  >
                    <Input disabled />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Update Profile
                  </Button>
                </div>
              </Form>
            </TabPane>

            <TabPane tab="Work Information" key="work">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <Input value={employee?.employeeId} disabled />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <Input value={employee?.workInfo?.department} disabled />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <Input value={employee?.workInfo?.designation} disabled />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joining Date
                  </label>
                  <Input 
                    value={employee?.workInfo?.joiningDate ? 
                      new Date(employee.workInfo.joiningDate).toLocaleDateString() : ''
                    } 
                    disabled 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <Input value={employee?.workInfo?.employmentType} disabled />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Location
                  </label>
                  <Input value={employee?.workInfo?.workLocation} disabled />
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;