import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', values);
      localStorage.setItem('token', response.data.access_token);
      message.success('Login successful');
      navigate('/users');
    } catch (error) {
      message.error('Invalid username or password');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Card
        title={<span><LockOutlined /> Please enter your login details.</span>}
        style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      >
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', color: '#888', fontSize: '12px' }}>
          OpenCart © 2009-2025 All Rights Reserved.
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
