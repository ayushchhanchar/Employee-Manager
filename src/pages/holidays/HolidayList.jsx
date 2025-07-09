import React, { useState, useEffect } from 'react';
import { Calendar, Card, Button, Modal, Form, Input, DatePicker, Select, message, Tag, List } from 'antd';
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import Layout from '../../components/Layout/Layout';
import { holidayAPI } from '../../services/api';
import { userRoleSelector } from '../../store/authStore';

const { Option } = Select;
const { TextArea } = Input;

const HolidayList = () => {
  const userRole = useRecoilValue(userRoleSelector);
  const [holidays, setHolidays] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchHolidays();
    fetchUpcomingHolidays();
  }, []);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await holidayAPI.getCalendar({ year: dayjs().year() });
      setHolidays(response.data.data);
    } catch (error) {
      message.error('Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingHolidays = async () => {
    try {
      const response = await holidayAPI.getUpcoming({ limit: 5 });
      setUpcomingHolidays(response.data.data);
    } catch (error) {
      console.error('Failed to fetch upcoming holidays:', error);
    }
  };

  const handleCreate = async (values) => {
    try {
      await holidayAPI.create({
        ...values,
        date: values.date.toISOString()
      });
      message.success('Holiday created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchHolidays();
      fetchUpcomingHolidays();
    } catch (error) {
      message.error('Failed to create holiday');
    }
  };

  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const holiday = holidays.find(h => h.date === dateStr);
    
    if (holiday) {
      return (
        <div className="text-center">
          <Tag color={holiday.backgroundColor} size="small">
            {holiday.title}
          </Tag>
        </div>
      );
    }
    return null;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'National': return 'red';
      case 'Regional': return 'orange';
      case 'Company': return 'blue';
      case 'Optional': return 'gray';
      default: return 'default';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Holidays</h1>
            <p className="text-gray-600">View company holidays and events</p>
          </div>
          {['admin', 'hr'].includes(userRole) && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
            >
              Add Holiday
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card title="Holiday Calendar">
              <Calendar 
                dateCellRender={dateCellRender}
                mode="month"
              />
            </Card>
          </div>

          {/* Upcoming Holidays */}
          <div>
            <Card title="Upcoming Holidays" extra={<CalendarOutlined />}>
              <List
                dataSource={upcomingHolidays}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                          <Tag color={getTypeColor(item.type)}>{item.type}</Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div>{dayjs(item.date).format('MMM DD, YYYY')}</div>
                          <div className="text-gray-500 text-sm">
                            {dayjs(item.date).diff(dayjs(), 'days')} days left
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </div>

        {/* Create Holiday Modal */}
        <Modal
          title="Add Holiday"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={500}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreate}
          >
            <Form.Item
              name="name"
              label="Holiday Name"
              rules={[{ required: true, message: 'Please enter holiday name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Please select type' }]}
            >
              <Select>
                <Option value="National">National</Option>
                <Option value="Regional">Regional</Option>
                <Option value="Company">Company</Option>
                <Option value="Optional">Optional</Option>
              </Select>
            </Form.Item>

            <Form.Item name="description" label="Description">
              <TextArea rows={3} />
            </Form.Item>

            <div className="flex justify-end space-x-4">
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Add Holiday
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default HolidayList;