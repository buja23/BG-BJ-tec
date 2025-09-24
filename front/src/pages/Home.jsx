// src/pages/Home.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd'; // Importe o Layout do antd
import Sidebar from '../components/Sidebar';

const { Content } = Layout; // Componente para o conteúdo principal

const HomePage = () => {
  return (
    // O Layout principal agora ocupa a tela inteira
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar /> {/* O Sider (nossa Sidebar) virá aqui */}
      
      {/* Este Layout interno segura o conteúdo */}
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;