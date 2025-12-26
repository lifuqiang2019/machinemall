import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Row, Col, Card, Tag, Input, Select, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, FilterOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  category?: { name: string };
  images?: string[];
  createdAt: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProducts(response.data);
    } catch (error) {
      message.error('获取商品失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      message.success('商品删除成功');
      fetchProducts();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '图片',
      key: 'image',
      width: 80,
      align: 'center' as const,
      render: (_: any, record: Product) => (
        <div style={{ border: '1px solid #ddd', padding: 4, display: 'inline-block', width: 50, height: 50, overflow: 'hidden' }}>
            {record.images && record.images.length > 0 ? (
                <img src={record.images[0]} alt={record.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <PictureOutlined style={{ fontSize: 24, color: '#ccc', lineHeight: '40px' }} />
            )}
        </div>
      )
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => <Tag color={stock > 10 ? 'green' : 'red'}>{stock}</Tag>,
    },
    {
      title: '分类',
      dataIndex: ['category', 'name'],
      key: 'category',
    },
    {
      title: '操作',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Product) => (
        <Space>
            <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => navigate(`/products/edit/${record.id}`)} />
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
        <h2 style={{ margin: 0 }}>商品管理</h2>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/products/add')} />
          <Button type="primary" danger icon={<DeleteOutlined />} />
        </Space>
      </div>

      <Row gutter={24}>
        <Col span={18}>
            <Card title={<Space><FilterOutlined /> 商品列表</Space>} bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                <Table 
                    columns={columns} 
                    dataSource={products} 
                    rowKey="id" 
                    loading={loading}
                    rowSelection={{}}
                    pagination={{ position: ['bottomRight'] }}
                />
            </Card>
        </Col>
        <Col span={6}>
            <Card title="筛选" bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div>
                        <div style={{ marginBottom: 8 }}>商品名称</div>
                        <Input placeholder="商品名称" />
                    </div>
                    <div>
                        <div style={{ marginBottom: 8 }}>价格</div>
                        <Input placeholder="价格" />
                    </div>
                    <div>
                        <div style={{ marginBottom: 8 }}>状态</div>
                        <Select style={{ width: '100%' }} defaultValue="enabled">
                            <Select.Option value="enabled">上架</Select.Option>
                            <Select.Option value="disabled">下架</Select.Option>
                        </Select>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <Button type="primary" icon={<FilterOutlined />}>筛选</Button>
                    </div>
                </Space>
            </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductsPage;
