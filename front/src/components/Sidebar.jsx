import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext'; // Importa o contexto do usuário
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
  ShoppingOutlined,
  TagOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { usuario } = useUsuario(); // Pega o usuário do contexto

  // Define os itens de menu para cada CARGO
  const gerenteItems = [
    { key: '/app/mesas', icon: <AppstoreOutlined />, label: 'Mesas' },
    { key: '/app/produtos', icon: <ShoppingOutlined />, label: 'Venda Direta' },
    { key: '/app/vendas', icon: <ShoppingOutlined />, label: 'Vendas' },
    { key: '/app/estoque', icon: <BoxPlotOutlined />, label: 'Estoque' },
    { key: '/app/clientes', icon: <UserOutlined />, label: 'Clientes' },
    { key: '/app/cupons', icon: <TagOutlined />, label: 'Cupons' },
    { key: '/app/financeiro', icon: <BankOutlined />, label: 'Financeiro' },
    { key: '/app/dre', icon: <PieChartOutlined />, label: 'DRE' },
  ];

  const caixaItems = [
    { key: '/app/caixa', icon: <CalculatorOutlined />, label: 'Caixa' },
    { key: '/app/mesas', icon: <AppstoreOutlined />, label: 'Mesas' },
    { key: '/app/estoque', icon: <BoxPlotOutlined />, label: 'Estoque' },
    { key: '/app/clientes', icon: <UserOutlined />, label: 'Clientes' },
    { key: '/app/cupons', icon: <TagOutlined />, label: 'Cupons' },
    { key: '/app/vendas', icon: <ShoppingOutlined />, label: 'Vendas' },
  ];

  const garcomItems = [
    { key: '/app/mesas', icon: <AppstoreOutlined />, label: 'Mesas' },
    { key: '/app/produtos', icon: <ShoppingOutlined />, label: 'Venda Direta' },
    { key: '/app/clientes', icon: <UserOutlined />, label: 'Clientes' },
    { key: '/app/estoque', icon: <BoxPlotOutlined />, label: 'Ver Estoque' },
  ];

  // Função para determinar qual menu exibir
  const getMenuItems = () => {
    switch (usuario?.cargo) {
      case 'gerente':
        return gerenteItems;
      case 'caixa':
        return caixaItems;
      case 'garcom':
        return garcomItems;
      // Adicione outros cargos como 'caixa' aqui, se necessário
      default:
        return []; // Retorna um menu vazio por padrão ou para clientes
    }
  };

  const menuItems = getMenuItems();

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
          items={menuItems.map(item => ({
            ...item,
            icon: item.icon,
            label: <Link to={item.key}>{item.label}</Link>
          }))}
        />

        <Menu
          theme="dark"
          mode="inline"
          style={{ marginTop: 'auto', borderRight: 0 }}
          items={[{
            key: 'logout',
            icon: <LogoutOutlined />,
            label: <span onClick={handleLogout}>Sair</span>
          }]}
        />
      </div>
    </Sider>
  );
};