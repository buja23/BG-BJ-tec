import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  CalculatorOutlined,
  AppstoreOutlined,
  RocketOutlined,
  UserOutlined,
  TrophyOutlined,
  BoxPlotOutlined,
  ShopOutlined,
  BankOutlined,
  PieChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

// Itens do menu atualizados com o prefixo "/app"
const menuItems = [
  { key: '/app/caixa', icon: <CalculatorOutlined />, label: 'Caixa' },
  { key: '/app/mesas', icon: <AppstoreOutlined />, label: 'Mesas' },
  { key: '/app/deliverys', icon: <RocketOutlined />, label: 'Entregas' },
  { key: '/app/clientes', icon: <UserOutlined />, label: 'Clientes' },
  { key: '/app/ranking', icon: <TrophyOutlined />, label: 'Ranking' },
  { key: '/app/estoque', icon: <BoxPlotOutlined />, label: 'Estoque' },
  { key: '/app/negocio', icon: <ShopOutlined />, label: 'Meu Negócio' },
  { key: '/app/financeiro', icon: <BankOutlined />, label: 'Financeiro' },
  { key: '/app/dre', icon: <PieChartOutlined />, label: 'DRE' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    console.log("Usuário deslogado!");
    // Lógica de logout aqui (ex: limpar localStorage e redirecionar)
    // window.location.href = '/login'; 
  };

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={(value) => setCollapsed(value)}
    >
      <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
        >
          {menuItems.map(item => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>

        <Menu
            theme="dark"
            mode="inline"
            style={{ marginTop: 'auto', borderRight: 0 }}
        >
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Sair
            </Menu.Item>
        </Menu>
      </div>
    </Sider>
  );
};