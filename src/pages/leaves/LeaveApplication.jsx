import React, { useState } from 'react';
import { Form, Input, Button, Card, Select, DatePicker, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Layout from '../../components/Layout/Layout';
import { leaveAPI } from '../../services/api';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const LeaveApplication = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        leaveType: values.leaveType,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        reason: values.reason,
        teamEmail: values.teamEmail,
        handoverNotes: values.handoverNotes
      };

      await leaveAPI.apply(payload);
      message.success('Leave application submitted successfully');
      navigate('/leaves');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to submit leave application');
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current) => {
    // Disable past dates
    return current && current < dayjs().startOf('day');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/leaves')}
          >
            Back to Leaves
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
            <p className="text-gray-600">Submit a new leave request</p>
          </div>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
          >
            <Form.Item
              name="leaveType"
              label="Leave Type"
              rules={[{ required: true, message: 'Please select leave type' }]}
            >
              <Select placeholder="Select leave type">
                <Option value="Annual">Annual Leave</Option>
                <Option value="Sick">Sick Leave</Option>
                <Option value="Casual">Casual Leave</Option>
                <Option value="Maternity">Maternity Leave</Option>
                <Option value="Paternity">Paternity Leave</Option>
                <Option value="Emergency">Emergency Leave</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Leave Duration"
              rules={[{ required: true, message: 'Please select leave dates' }]}
            >
              <RangePicker 
                style={{ width: '100%' }}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Reason for Leave"
              rules={[{ required: true, message: 'Please provide reason for leave' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="Please provide detailed reason for your leave request"
              />
            </Form.Item>

            <Form.Item
              name="teamEmail"
              label="Team Email (Optional)"
              rules={[{ type: 'email', message: 'Please enter valid email' }]}
            >
              <Input placeholder="team@company.com" />
            </Form.Item>

            <Form.Item
              name="handoverNotes"
              label="Handover Notes (Optional)"
            >
              <TextArea 
                rows={3} 
                placeholder="Any important tasks or responsibilities to handover during your absence"
              />
            </Form.Item>

            <div className="flex justify-end space-x-4">
              <Button onClick={() => navigate('/leaves')}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit Application
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default LeaveApplication;