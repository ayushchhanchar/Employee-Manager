import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Tag, Space, message, Calendar, Modal } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Layout from '../../components/Layout/Layout';
import { attendanceAPI } from '../../services/api';

const { Title, Text } = Typography;

const Attendance = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    fetchTodayAttendance();
    fetchAttendanceData();
    
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const response = await attendanceAPI.getToday();
      setTodayAttendance(response.data.data);
    } catch (error) {
      console.error('Failed to fetch today attendance:', error);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await attendanceAPI.getSummary({
        month: dayjs().month() + 1,
        year: dayjs().year()
      });
      setAttendanceData(response.data.data.attendance || []);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await attendanceAPI.checkIn({ location: 'Office' });
      message.success('Checked in successfully!');
      fetchTodayAttendance();
    } catch (error) {
      message.error(error.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await attendanceAPI.checkOut({ location: 'Office' });
      message.success('Checked out successfully!');
      fetchTodayAttendance();
    } catch (error) {
      message.error(error.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
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

  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const attendance = attendanceData.find(a => 
      dayjs(a.date).format('YYYY-MM-DD') === dateStr
    );

    if (attendance) {
      return (
        <div className="text-center">
          <Tag color={getStatusColor(attendance.status)} size="small">
            {attendance.status}
          </Tag>
        </div>
      );
    }
    return null;
  };

  const canCheckIn = !todayAttendance?.checkIn;
  const canCheckOut = todayAttendance?.checkIn && !todayAttendance?.checkOut;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <Title level={2}>Attendance</Title>
          <Text type="secondary">Track your daily attendance and view history</Text>
        </div>

        {/* Current Time and Status */}
        <Card>
          <div className="text-center space-y-4">
            <div>
              <Title level={3} className="mb-2">
                {currentTime.format('dddd, MMMM D, YYYY')}
              </Title>
              <Title level={1} className="text-blue-600 mb-0">
                {currentTime.format('HH:mm:ss')}
              </Title>
            </div>

            <div className="flex justify-center space-x-4">
              {todayAttendance?.checkIn && (
                <div className="text-center">
                  <Text type="secondary">Check In</Text>
                  <div className="font-semibold text-green-600">
                    {dayjs(todayAttendance.checkIn).format('HH:mm:ss')}
                  </div>
                </div>
              )}
              
              {todayAttendance?.checkOut && (
                <div className="text-center">
                  <Text type="secondary">Check Out</Text>
                  <div className="font-semibold text-red-600">
                    {dayjs(todayAttendance.checkOut).format('HH:mm:ss')}
                  </div>
                </div>
              )}

              {todayAttendance?.totalHours && (
                <div className="text-center">
                  <Text type="secondary">Total Hours</Text>
                  <div className="font-semibold text-blue-600">
                    {todayAttendance.totalHours.toFixed(2)}h
                  </div>
                </div>
              )}
            </div>

            <Space size="large">
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={handleCheckIn}
                disabled={!canCheckIn}
                loading={loading}
              >
                Check In
              </Button>
              
              <Button
                danger
                size="large"
                icon={<CloseCircleOutlined />}
                onClick={handleCheckOut}
                disabled={!canCheckOut}
                loading={loading}
              >
                Check Out
              </Button>
            </Space>

            {todayAttendance?.status && (
              <div className="mt-4">
                <Text>Today's Status: </Text>
                <Tag color={getStatusColor(todayAttendance.status)} size="large">
                  {todayAttendance.status}
                </Tag>
              </div>
            )}
          </div>
        </Card>

        {/* Calendar View */}
        <Card title="Attendance Calendar">
          <Calendar 
            dateCellRender={dateCellRender}
            mode="month"
          />
        </Card>
      </div>
    </Layout>
  );
};

export default Attendance;