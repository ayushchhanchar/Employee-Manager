import React from 'react';
import { Card, Switch, Button, Divider, Typography } from 'antd';
import Layout from '../components/Layout/Layout';

const { Title, Text } = Typography;

const Settings = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Title level={2}>Settings</Title>
          <Text type="secondary">Manage your account preferences</Text>
        </div>

        <Card title="Notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-gray-500 text-sm">Receive email notifications for important updates</div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Divider />
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Leave Notifications</div>
                <div className="text-gray-500 text-sm">Get notified about leave request updates</div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Divider />
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Announcement Notifications</div>
                <div className="text-gray-500 text-sm">Receive notifications for new announcements</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Card title="Security">
          <div className="space-y-4">
            <Button type="primary">Change Password</Button>
            <div className="text-gray-500 text-sm">
              Update your password to keep your account secure
            </div>
          </div>
        </Card>

        <Card title="Privacy">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Profile Visibility</div>
                <div className="text-gray-500 text-sm">Make your profile visible to other employees</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;