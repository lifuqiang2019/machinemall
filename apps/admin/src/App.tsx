import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout';
import UsersPage from './pages/UsersPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import ProductFormPage from './pages/ProductFormPage';
import LayoutPage from './pages/LayoutPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';

import { SocketProvider } from './contexts/SocketContext';

// Simple Auth Guard
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><SocketProvider><AppLayout /></SocketProvider></ProtectedRoute>}>
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="layout" element={<LayoutPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="products">
            <Route index element={<ProductsPage />} />
            <Route path="add" element={<ProductFormPage />} />
            <Route path="edit/:id" element={<ProductFormPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
