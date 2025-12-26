import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Space, message, Card, TreeSelect, Popconfirm, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

interface LayoutItem {
  id: number;
  name: string;
  order: number;
  isActive: boolean;
  categoryId: number;
  category?: {
      name: string;
  };
}

const LayoutPage: React.FC = () => {
  const [layouts, setLayouts] = useState<LayoutItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LayoutItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLayouts();
    fetchCategories();
  }, []);

  const fetchLayouts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/layout');
      setLayouts(response.data);
    } catch (error) {
      message.error('获取布局配置失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await axios.patch(`http://localhost:3000/layout/${editingItem.id}`, values);
        message.success('更新成功');
      } else {
        await axios.post('http://localhost:3000/layout', values);
        message.success('创建成功');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingItem(null);
      fetchLayouts();
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || '操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/layout/${id}`);
      message.success('删除成功');
      fetchLayouts();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleEdit = (record: LayoutItem) => {
    setEditingItem(record);
    // Explicitly set categoryId from relation object if needed, though record.categoryId should be present
    // TypeORM usually returns relation object but maybe not the foreign key column if not explicitly selected?
    // Let's ensure we use the relation's ID if available.
    const formData = {
        ...record,
        type: record.type || 'product_section', // Ensure type has a default
        categoryId: record.category?.id || record.categoryId
    };
    form.setFieldsValue(formData);
    setIsModalOpen(true);
  };

  // Convert categories to TreeSelect format
  const renderTreeNodes = (data: any[]): any[] =>
    data.map((item) => ({
      title: item.name,
      value: item.id,
      children: item.children ? renderTreeNodes(item.children) : [],
    }));

  const columns = [
    {
      title: '模块名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '模块类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
          const map: Record<string, string> = { 'product_section': '商品楼层', 'hero': '首页轮播' };
          return <Tag color="blue">{map[type] || type}</Tag>;
      }
    },
    {
      title: '关联分类',
      dataIndex: ['category', 'name'],
      key: 'category',
      render: (text: string, record: LayoutItem) => record.type === 'product_section' ? (text || '未关联') : '-',
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (isActive ? '启用' : '禁用'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: LayoutItem) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
          <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>首页布局管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>
          添加模块
        </Button>
      </div>

      <Card bordered={false}>
        <Table columns={columns} dataSource={layouts} rowKey="id" loading={loading} pagination={false} />
      </Card>

      <Modal
        title={editingItem ? '编辑模块' : '添加模块'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" initialValues={{ isActive: true, order: 0 }}>
          <Form.Item name="name" label="模块名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="模块类型" rules={[{ required: true }]}>
             <Select onChange={() => {}}>
                 <Select.Option value="product_section">商品楼层 (展示分类商品)</Select.Option>
                 <Select.Option value="hero">首页轮播 (顶部大图)</Select.Option>
             </Select>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.type !== curr.type}>
            {({ getFieldValue }) => {
              return getFieldValue('type') === 'product_section' ? (
                  <Form.Item name="categoryId" label="关联分类" rules={[{ required: true }]}>
                    <TreeSelect
                        treeData={renderTreeNodes(categories)}
                        placeholder="选择分类"
                        treeDefaultExpandAll
                    />
                  </Form.Item>
              ) : null;
            }}
          </Form.Item>
          <Form.Item name="order" label="排序 (越小越靠前)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isActive" label="是否启用" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LayoutPage;
