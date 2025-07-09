import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Form, Input, Button, Card, Typography, Divider, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { authState } from '../../store/authStore';
import { authAPI } from '../../services/api';

const { Title, Text } = Typography;

const Login = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.login(values);
      const { token } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Get user profile
      const profileResponse = await authAPI.getProfile();
      const user = profileResponse.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuth({
        isAuthenticated: true,
        user,
        token,
        loading: false,
        error: null
      });
      
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed');
      setAuth(prev => ({ ...prev, error: error.response?.data?.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      await authAPI.register(values);
      message.success('Registration successful! Please login.');
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.open('http://localhost:5000/api/auth/google', '_self');
  };

  const LoginForm = () => (
    <Form onFinish={handleLogin} layout="vertical" size="large">
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Login
        </Button>
      </Form.Item>
      
      <Divider>Or</Divider>
      
      <Button 
        icon={<GoogleOutlined />} 
        onClick={handleGoogleLogin}
        block
        size="large"
      >
        Continue with Google
      </Button>
    </Form>
  );

  const RegisterForm = () => (
    <Form onFinish={handleRegister} layout="vertical" size="large">
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      
      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 6, message: 'Password must be at least 6 characters!' }
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>
      
      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Register
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-6">
          <Title level={2} className="mb-2">Employee Management</Title>
          <Text type="secondary">Welcome back! Please sign in to continue.</Text>
        </div>
        
        <Tabs
          defaultActiveKey="login"
          centered
          items={[
            {
              key: 'login',
              label: 'Login',
              children: <LoginForm />
            },
            {
              key: 'register',
              label: 'Register',
              children: <RegisterForm />
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default Login;