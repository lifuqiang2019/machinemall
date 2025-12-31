import React from 'react';
import { Layout, Menu, theme, Dropdown, Avatar, Space, Button, Breadcrumb } from 'antd';
import { UserOutlined, AppstoreOutlined, ShoppingOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined, BellOutlined, HomeOutlined, LayoutOutlined, MessageOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Badge } from 'antd';
import { useSocket } from '../contexts/SocketContext';

const { Header, Content, Sider } = Layout;

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  const { unreadCount, isConnected } = useSocket();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const userMenu = [
    {
      key: '1',
      label: '个人资料',
    },
    {
      key: '2',
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const items = [
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/categories',
      icon: <AppstoreOutlined />,
      label: '分类管理',
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: '商品管理',
    },
    {
      key: '/layout',
      icon: <LayoutOutlined />,
      label: '布局管理',
    },
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: '客服管理',
    },
  ];

  const breadcrumbNameMap: Record<string, string> = {
    '/users': '用户管理',
    '/categories': '分类管理',
    '/products': '商品管理',
    '/products/add': '添加商品',
    '/products/edit': '编辑商品',
    '/layout': '布局管理',
    '/chat': '客服管理',
  };

  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = [
    {
      title: <Link to="/"><HomeOutlined /></Link>,
      key: 'home',
    },
  ].concat(
    pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      // Handle dynamic routes like /products/edit/:id
      let title = breadcrumbNameMap[url];
      if (!title && url.startsWith('/products/edit/')) {
          title = '编辑商品';
      }
      if (!title) return null as any;
      
      return {
        key: url,
        title: <Link to={url}>{title}</Link>,
      };
    }).filter(Boolean)
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', height: 64, zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: 40, color: '#1890ff' }}>
                鼎装网 <span style={{ fontSize: '12px', color: '#888' }}>后台管理系统</span>
            </div>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '16px', width: 64, height: 64 }}
            />
        </div>
        <Space size="large">
            <BellOutlined style={{ fontSize: '18px' }} />
            <Dropdown menu={{ items: userMenu }}>
                <Space style={{ cursor: 'pointer' }}>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                    <span>管理员</span>
                </Space>
            </Dropdown>
        </Space>
      </Header>
      <Layout>
        <Sider 
            trigger={null} 
            collapsible 
            collapsed={collapsed} 
            width={260}
            style={{ background: '#2d353c' }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={items}
            onClick={(e) => navigate(e.key)}
            style={{ background: '#2d353c', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb items={breadcrumbItems} style={{ margin: '16px 0' }} />
          <Content
            style={{
              background: '#f5f5f5', // Light gray background for content area to match OpenCart card style
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
