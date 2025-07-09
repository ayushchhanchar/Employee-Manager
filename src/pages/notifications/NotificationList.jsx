import React, { useState, useEffect } from 'react';
import { List, Card, Button, Tag, Avatar, message, Space } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Layout from '../../components/Layout/Layout';
import { notificationAPI } from '../../services/api';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      message.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      message.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      message.success('All notifications marked as read');
      fetchNotifications();
    } catch (error) {
      message.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.delete(id);
      message.success('Notification deleted');
      fetchNotifications();
    } catch (error) {
      message.error('Failed to delete notification');
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

  const getTypeIcon = (type) => {
    return <BellOutlined />;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              type="primary" 
              icon={<CheckOutlined />}
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </Button>
          )}
        </div>

        <Card>
          <List
            loading={loading}
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                key={item._id}
                className={!item.isRead ? 'bg-blue-50' : ''}
                actions={[
                  !item.isRead && (
                    <Button 
                      type="link" 
                      icon={<CheckOutlined />}
                      onClick={() => handleMarkAsRead(item._id)}
                    >
                      Mark as Read
                    </Button>
                  ),
                  <Button 
                    type="link" 
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      icon={getTypeIcon(item.type)}
                      style={{ 
                        backgroundColor: !item.isRead ? '#1890ff' : '#f0f0f0',
                        color: !item.isRead ? 'white' : '#999'
                      }} 
                    />
                  }
                  title={
                    <div className="flex items-center space-x-2">
                      <span className={!item.isRead ? 'font-semibold' : ''}>
                        {item.title}
                      </span>
                      <Tag color={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Tag>
                      <Tag>{item.type}</Tag>
                    </div>
                  }
                  description={
                    <div>
                      <p className="mb-2">{item.message}</p>
                      <div className="text-gray-500 text-sm">
                        {dayjs(item.createdAt).format('MMM DD, YYYY HH:mm')}
                        {item.sender && (
                          <span> • From: {item.sender.username}</span>
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default NotificationList;