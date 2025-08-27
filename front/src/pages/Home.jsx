import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../layout/Sidebar';
import Header from '../../../layout/Header';

const { Content } = Layout;

const Home = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 250 }}> {/* Margin para a sidebar fixa */}
        <Header />
        <Content style={{ 
          margin: '16px', 
          padding: 24, 
          background: '#fff',
          minHeight: 'calc(100vh - 96px)'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;