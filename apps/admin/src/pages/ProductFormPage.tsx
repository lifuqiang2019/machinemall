import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Select, TreeSelect, Space, Row, Col, Radio, Switch } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css'; // Import css

import ImageUpload from '../components/ImageUpload';

const ProductFormPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // If id exists, it's edit mode
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState<string>('');
  
  // Editor state
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState('<p></p>');

  // Toolbar configuration
  const toolbarConfig: Partial<IToolbarConfig> = { };
  // Editor configuration
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入商品详情...',
    MENU_CONF: {
        uploadImage: {
            server: 'http://localhost:3000/upload',
            fieldName: 'file',
            maxFileSize: 5 * 1024 * 1024, // 5M
            customInsert(res: any, insertFn: any) {
                // res is server response
                if (res.url) {
                    insertFn(res.url, '', '');
                } else {
                    message.error('上传图片失败');
                }
            },
        }
    }
  };

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/products/${productId}`);
      const product = response.data;
      // Transform data for form
      form.setFieldsValue({
        ...product,
        category: product.category?.id,
      });
      // Set description to editor
      if (product.description) {
          setHtml(product.description);
      }
      
      if (product.mainImage) {
          setMainImage(product.mainImage);
      } else if (product.images && product.images.length > 0) {
          setMainImage(product.images[0]);
      }
    } catch (error) {
      message.error('获取商品信息失败');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
        const payload = {
            ...values,
            description: html, // Use editor html content
            mainImage: mainImage
        };

        if (id) {
            await axios.patch(`http://localhost:3000/products/${id}`, payload);
            message.success('商品更新成功');
        } else {
            await axios.post('http://localhost:3000/products', payload);
            message.success('商品创建成功');
        }
        navigate('/products');
    } catch (error) {
        message.error('操作失败');
    } finally {
        setLoading(false);
    }
  };

  // Convert categories to TreeSelect format
  const renderTreeNodes = (data: any[]): any[] =>
    data.map((item) => ({
      title: item.name,
      value: item.id,
      children: item.children ? renderTreeNodes(item.children) : [],
    }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>{id ? '编辑商品' : '添加商品'}</h2>
        <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')}>返回</Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()} loading={loading}>保存</Button>
        </Space>
      </div>

      <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ stock: 0, price: 0, images: [] }}
        >
            <Row gutter={24}>
                <Col span={16}>
                    <Form.Item name="name" label="商品名称" rules={[{ required: true, message: '请输入商品名称' }]}>
                        <Input />
                    </Form.Item>
                    
                    <Form.Item name="images" label="商品图片">
                        <ImageUpload 
                            mainImage={mainImage}
                            onMainImageChange={setMainImage}
                        />
                    </Form.Item>
                    
                    {/* Main Image Selector if needed, or just let ImageUpload handle default logic */}
                    <Form.Item label="选择主图">
                        <Radio.Group value={mainImage} onChange={e => setMainImage(e.target.value)}>
                            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.images !== curr.images}>
                                {({ getFieldValue }) => {
                                    const images = getFieldValue('images') || [];
                                    return images.map((url: string) => (
                                        <Radio value={url} key={url}>
                                            <img src={url} alt="option" style={{ width: 30, height: 30, objectFit: 'cover', verticalAlign: 'middle' }} />
                                        </Radio>
                                    ));
                                }}
                            </Form.Item>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="商品详情 (富文本)">
                        <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                            <Toolbar
                                editor={editor}
                                defaultConfig={toolbarConfig}
                                mode="default"
                                style={{ borderBottom: '1px solid #ccc' }}
                            />
                            <Editor
                                defaultConfig={editorConfig}
                                value={html}
                                onCreated={setEditor}
                                onChange={editor => setHtml(editor.getHtml())}
                                mode="default"
                                style={{ height: '500px', overflowY: 'hidden' }}
                            />
                        </div>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Card title="基本信息" size="small" style={{ marginBottom: 24 }}>
                        <Form.Item name="price" label="价格" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} prefix="¥" min={0} />
                        </Form.Item>
                        <Form.Item name="stock" label="库存" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                        <Form.Item name="isFeatured" label="推荐商品" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item name="category" label="分类">
                            <TreeSelect
                                allowClear
                                treeData={renderTreeNodes(categories)}
                                placeholder="选择分类"
                                treeDefaultExpandAll
                            />
                        </Form.Item>
                    </Card>
                </Col>
            </Row>
        </Form>
      </Card>
    </div>
  );
};

export default ProductFormPage;
