import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Row, Col, Card, Select, TreeSelect, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, FilterOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';

interface Category {
  id: number;
  name: string;
  description: string;
  image?: string;
  createdAt: string;
  children?: Category[];
  parent?: Category;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/categories');
      // Ensure children is undefined if empty array to avoid empty expand icon
      // Also inject parentId to each child for correct editing logic
      const processData = (data: Category[], parentId?: number): Category[] => {
          return data.map(item => {
              const children = item.children && item.children.length > 0 ? processData(item.children, item.id) : undefined;
              return {
                  ...item,
                  key: item.id, // Ensure key is present for Antd Table
                  parentId: parentId, // Inject parentId manually since it might be missing in tree structure
                  children
              };
          });
      };
      setCategories([...processData(response.data)]); // Create new array reference to force re-render
    } catch (error) {
      message.error('获取分类失败');
    } finally {
      setLoading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const data = { ...values, image: mainImage };
      console.log('Submitting Category Data:', data);
      if (editingCategory) {
        await axios.patch(`http://localhost:3000/categories/${editingCategory.id}`, data);
        message.success('分类更新成功');
      } else {
        await axios.post('http://localhost:3000/categories', data);
        message.success('分类创建成功');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingCategory(null);
      setMainImage('');
      fetchCategories();
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || '操作失败');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setMainImage(category.image || '');
    form.setFieldsValue({
        ...category,
        parentId: category.parentId || category.parent?.id
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/categories/${id}`);
      message.success('分类删除成功');
      fetchCategories();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '图标',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
          image ? <img src={image} alt="icon" style={{ width: 30, height: 30, objectFit: 'contain' }} /> : <PictureOutlined style={{ color: '#ccc' }} />
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Category) => (
        <Space>
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
            <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
        </Space>
      ),
    },
  ];

  // Convert categories to TreeSelect format
  const renderTreeNodes = (data: Category[]): any[] =>
    data.map((item) => ({
      title: item.name,
      value: item.id,
      children: item.children ? renderTreeNodes(item.children) : [],
    }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>分类管理</h2>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCategory(null); form.resetFields(); setMainImage(''); setIsModalOpen(true); }} />
          <Button type="primary" danger icon={<DeleteOutlined />} />
        </Space>
      </div>

      <Row gutter={24}>
        <Col span={18}>
            <Card title={<Space><FilterOutlined /> 分类列表</Space>} bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                <Table 
                    columns={columns} 
                    dataSource={categories} 
                    rowKey="id" 
                    loading={loading} 
                    rowSelection={{}}
                    pagination={false}
                    expandable={{ 
                        defaultExpandAllRows: true,
                        childrenColumnName: 'children' // Explicitly set, though default
                    }}
                />
            </Card>
        </Col>
        <Col span={6}>
            <Card title="筛选" bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div>
                        <div style={{ marginBottom: 8 }}>分类名称</div>
                        <Input placeholder="分类名称" />
                    </div>
                    <div>
                        <div style={{ marginBottom: 8 }}>状态</div>
                        <Select style={{ width: '100%' }} defaultValue="enabled">
                            <Select.Option value="enabled">启用</Select.Option>
                            <Select.Option value="disabled">禁用</Select.Option>
                        </Select>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <Button type="primary" icon={<FilterOutlined />}>筛选</Button>
                    </div>
                </Space>
            </Card>
        </Col>
      </Row>

      <Modal title={editingCategory ? "编辑分类" : "添加分类"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="分类图标/图片">
             <ImageUpload 
                value={mainImage ? [mainImage] : []}
                onChange={(urls) => setMainImage(urls[0] || '')}
                maxCount={1}
             />
          </Form.Item>
          <Form.Item name="parentId" label="父级分类">
            <TreeSelect
                allowClear
                treeData={renderTreeNodes(categories)}
                placeholder="选择父级分类"
                treeDefaultExpandAll
            />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
