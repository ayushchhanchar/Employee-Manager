import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Space, Modal, Form, Input, Select, message, List, Avatar } from 'antd';
import { PlusOutlined, BellOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import Layout from '../../components/Layout/Layout';
import { announcementAPI } from '../../services/api';
import { userRoleSelector } from '../../store/authStore';

const { TextArea } = Input;
const { Option } = Select;

const AnnouncementList = () => {
  const userRole = useRecoilValue(userRoleSelector);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await announcementAPI.getAll();
      setAnnouncements(response.data.data);
    } catch (error) {
      message.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await announcementAPI.create(values);
      message.success('Announcement created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchAnnouncements();
    } catch (error) {
      message.error('Failed to create announcement');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await announcementAPI.markAsRead(id);
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'green';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Important': return 'red';
      case 'Urgent': return 'orange';
      case 'Event': return 'blue';
      case 'Holiday': return 'purple';
      default: return 'default';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600">Stay updated with company announcements</p>
          </div>
          {['admin', 'hr'].includes(userRole) && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
            >
              Create Announcement
            </Button>
          )}
        </div>

        <Card>
          <List
            loading={loading}
            dataSource={announcements}
            renderItem={(item) => (
              <List.Item
                key={item._id}
                actions={[
                  <Button 
                    type="link" 
                    onClick={() => handleMarkAsRead(item._id)}
                  >
                    Mark as Read
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      icon={<BellOutlined />} 
                      style={{ 
                        backgroundColor: item.priority === 'High' ? '#ff4d4f' : '#1890ff' 
                      }} 
                    />
                  }
                  title={
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{item.title}</span>
                      <Tag color={getTypeColor(item.type)}>{item.type}</Tag>
                      <Tag color={getPriorityColor(item.priority)}>{item.priority}</Tag>
                    </div>
                  }
                  description={
                    <div>
                      <p className="mb-2">{item.content}</p>
                      <div className="text-gray-500 text-sm">
                        By {item.createdBy?.username} • {dayjs(item.createdAt).format('MMM DD, YYYY')}
                        {item.expiryDate && (
                          <span> • Expires: {dayjs(item.expiryDate).format('MMM DD, YYYY')}</span>
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Create Announcement Modal */}
        <Modal
          title="Create Announcement"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreate}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter title' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true, message: 'Please enter content' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select>
                  <Option value="General">General</Option>
                  <Option value="Important">Important</Option>
                  <Option value="Urgent">Urgent</Option>
                  <Option value="Holiday">Holiday</Option>
                  <Option value="Event">Event</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <Select>
                  <Option value="Low">Low</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="High">High</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="targetAudience"
              label="Target Audience"
              rules={[{ required: true, message: 'Please select target audience' }]}
            >
              <Select>
                <Option value="All">All Employees</Option>
                <Option value="Employees">Employees Only</Option>
                <Option value="Managers">Managers Only</Option>
                <Option value="HR">HR Only</Option>
                <Option value="Department">Specific Department</Option>
              </Select>
            </Form.Item>

            <div className="flex justify-end space-x-4">
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create Announcement
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default AnnouncementList;