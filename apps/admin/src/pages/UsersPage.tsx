import React, { useEffect, useState } from 'react';
import { Table, Tag, Card, Row, Col, Input, Select, Button, Space, DatePicker, message, Modal, Form, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, FilterOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  // ... (rest is fine until columns)


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // Only send password if it's provided (not empty)
        if (!values.password) {
            delete values.password;
        }
        await axios.patch(`http://localhost:3000/users/${editingUser.id}`, values);
        message.success('用户更新成功');
      } else {
        await axios.post('http://localhost:3000/users', values);
        message.success('用户创建成功');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({ ...user, password: '' }); // Don't show hash
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      message.success('用户删除成功');
      fetchUsers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>{role === 'admin' ? '管理员' : '用户'}</Tag>
      ),
    },
    {
      title: '添加日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: User) => (
        <Space>
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
            <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0 }}>用户管理</h2>
            <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingUser(null); form.resetFields(); setIsModalOpen(true); }} />
                <Button type="primary" danger icon={<DeleteOutlined />} />
            </Space>
        </div>

        <Row gutter={24}>
            {/* Main Content */}
            <Col span={18}>
                <Card title={<Space><FilterOutlined /> 用户列表</Space>} bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                    <Table 
                        columns={columns} 
                        dataSource={users} 
                        rowKey="id" 
                        loading={loading}
                        pagination={{ position: ['bottomRight'] }}
                        rowSelection={{}}
                    />
                </Card>
            </Col>

            {/* Filter Sidebar */}
            <Col span={6}>
                <Card title="筛选" bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div>
                            <div style={{ marginBottom: 8 }}>姓名/邮箱</div>
                            <Input placeholder="请输入姓名或邮箱" />
                        </div>
                        <div>
                            <div style={{ marginBottom: 8 }}>用户组</div>
                            <Select style={{ width: '100%' }} placeholder="选择用户组">
                                <Select.Option value="admin">管理员</Select.Option>
                                <Select.Option value="user">普通用户</Select.Option>
                            </Select>
                        </div>
                        <div>
                            <div style={{ marginBottom: 8 }}>状态</div>
                            <Select style={{ width: '100%' }} defaultValue="enabled">
                                <Select.Option value="enabled">启用</Select.Option>
                                <Select.Option value="disabled">禁用</Select.Option>
                            </Select>
                        </div>
                        <div>
                            <div style={{ marginBottom: 8 }}>添加日期</div>
                            <DatePicker style={{ width: '100%' }} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <Button type="primary" icon={<FilterOutlined />}>筛选</Button>
                        </div>
                    </Space>
                </Card>
            </Col>
        </Row>

        <Modal 
            title={editingUser ? "编辑用户" : "添加用户"} 
            open={isModalOpen} 
            onOk={handleOk} 
            onCancel={() => setIsModalOpen(false)}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                    <Input />
                </Form.Item>
                <Form.Item 
                    name="password"  
                    label="密码" 
                    rules={[{ required: !editingUser, message: '请输入密码' }]}
                    extra={editingUser ? "如果不修改密码请留空" : ""}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item name="role" label="角色" initialValue="user">
                    <Select>
                        <Select.Option value="admin">管理员</Select.Option>
                        <Select.Option value="user">普通用户</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </div>
  );
};

export default UsersPage;
