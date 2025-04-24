/* CODIGO INDEX.JSX */

import React, { useState } from 'react';
import { Layout, Menu, Card, Statistic, Table, Tag, Space, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import {
  ShopOutlined,
  DollarOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  StarOutlined,
  InboxOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('caixa');
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Dados de exemplo
  const historicoCaixa = [
    { key: '1', data: '10/05/2023', valorInicial: 150.00, valorFinal: 1850.00, responsavel: 'João Silva' },
    { key: '2', data: '09/05/2023', valorInicial: 150.00, valorFinal: 2200.00, responsavel: 'Maria Souza' },
  ];

  const mesasAbertas = [
    { key: '1', mesa: 'Mesa 1', cliente: 'Cliente A', valor: 120.50, tempo: '45 min' },
    { key: '2', mesa: 'Mesa 3', cliente: 'Cliente B', valor: 85.00, tempo: '30 min' },
  ];

  const mesasFechadas = [
    { key: '1', mesa: 'Mesa 2', cliente: 'Cliente C', valor: 210.00, data: '10/05/2023 14:30' },
    { key: '2', mesa: 'Mesa 4', cliente: 'Cliente D', valor: 175.50, data: '10/05/2023 13:15' },
  ];

  const deliverys = [
    { key: '1', pedido: '#1001', cliente: 'Cliente E', endereco: 'Rua A, 123', valor: 95.00, status: 'Em preparo' },
    { key: '2', pedido: '#1002', cliente: 'Cliente F', endereco: 'Av. B, 456', valor: 65.50, status: 'Saiu para entrega' },
  ];

  const clientes = [
    { key: '1', nome: 'Cliente A', telefone: '(11) 9999-9999', email: 'cliente@email.com', totalCompras: 5 },
    { key: '2', nome: 'Cliente B', telefone: '(11) 8888-8888', email: 'cliente2@email.com', totalCompras: 3 },
  ];

  const rankingAtendimentos = [
    { key: '1', funcionario: 'João Silva', atendimentos: 25, valorTotal: 3250.00 },
    { key: '2', funcionario: 'Maria Souza', atendimentos: 18, valorTotal: 2850.00 },
  ];

  const produtosEstoque = [
    { key: '1', produto: 'Cerveja Artesanal', categoria: 'Bebidas', quantidade: 50, valorUnitario: 12.00 },
    { key: '2', produto: 'Pizza Margherita', categoria: 'Alimentos', quantidade: 30, valorUnitario: 45.00 },
  ];

  const financeiroResumo = {
    receitaMes: 25000.00,
    despesasMes: 18000.00,
    lucroMes: 7000.00,
    ticketMedio: 85.50
  };

  const dreResumo = {
    receitaAnual: 300000.00,
    custos: 150000.00,
    despesas: 100000.00,
    lucro: 50000.00
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'caixa':
        return (
          <div>
            <Card title="Controle de Caixa" style={{ marginBottom: 20 }}>
              {caixaAberto ? (
                <div>
                  <Statistic title="Saldo Atual" value={1850.00} precision={2} prefix="R$" />
                  <Button type="primary" danger style={{ marginTop: 16 }} onClick={() => setModalType('fecharCaixa') && setModalVisible(true)}>
                    Fechar Caixa
                  </Button>
                </div>
              ) : (
                <div>
                  <p>Caixa está fechado no momento</p>
                  <Button type="primary" onClick={() => setModalType('abrirCaixa') && setModalVisible(true)}>
                    Abrir Caixa
                  </Button>
                </div>
              )}
            </Card>
            
            <Card title="Histórico de Caixa">
              <Table 
                columns={[
                  { title: 'Data', dataIndex: 'data', key: 'data' },
                  { title: 'Valor Inicial', dataIndex: 'valorInicial', key: 'valorInicial', render: val => `R$ ${val.toFixed(2)}` },
                  { title: 'Valor Final', dataIndex: 'valorFinal', key: 'valorFinal', render: val => `R$ ${val.toFixed(2)}` },
                  { title: 'Responsável', dataIndex: 'responsavel', key: 'responsavel' },
                ]}
                dataSource={historicoCaixa}
              />
            </Card>
          </div>
        );
      
      case 'mesas':
        return (
          <div>
            <Card title="Mesas em Aberto" style={{ marginBottom: 20 }}>
              <Table 
                columns={[
                  { title: 'Mesa', dataIndex: 'mesa', key: 'mesa' },
                  { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
                  { title: 'Valor', dataIndex: 'valor', key: 'valor', render: val => `R$ ${val.toFixed(2)}` },
                  { title: 'Tempo', dataIndex: 'tempo', key: 'tempo' },
                  { 
                    title: 'Ações', 
                    key: 'actions', 
                    render: () => (
                      <Space size="middle">
                        <Button type="primary" size="small">Detalhes</Button>
                        <Button type="primary" danger size="small">Fechar</Button>
                      </Space>
                    )
                  },
                ]}
                dataSource={mesasAbertas}
              />
            </Card>
            
            <Card title="Mesas Fechadas">
              <Table 
                columns={[
                  { title: 'Mesa', dataIndex: 'mesa', key: 'mesa' },
                  { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
                  { title: 'Valor', dataIndex: 'valor', key: 'valor', render: val => `R$ ${val.toFixed(2)}` },
                  { title: 'Data/Hora', dataIndex: 'data', key: 'data' },
                  { 
                    title: 'Ações', 
                    key: 'actions', 
                    render: () => (
                      <Button type="primary" size="small">Detalhes</Button>
                    )
                  },
                ]}
                dataSource={mesasFechadas}
              />
            </Card>
          </div>
        );
      
      case 'deliverys':
        return (
          <Card title="Pedidos de Delivery">
            <Table 
              columns={[
                { title: 'Pedido', dataIndex: 'pedido', key: 'pedido' },
                { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
                { title: 'Endereço', dataIndex: 'endereco', key: 'endereco' },
                { title: 'Valor', dataIndex: 'valor', key: 'valor', render: val => `R$ ${val.toFixed(2)}` },
                { 
                  title: 'Status', 
                  dataIndex: 'status', 
                  key: 'status', 
                  render: status => (
                    <Tag color={status === 'Saiu para entrega' ? 'green' : 'orange'}>
                      {status}
                    </Tag>
                  )
                },
                { 
                  title: 'Ações', 
                  key: 'actions', 
                  render: () => (
                    <Space size="middle">
                      <Button type="primary" size="small">Atualizar</Button>
                      <Button type="primary" danger size="small">Cancelar</Button>
                    </Space>
                  )
                },
              ]}
              dataSource={deliverys}
            />
          </Card>
        );
      
      case 'clientes':
        return (
          <Card 
            title="Lista de Clientes" 
            extra={<Button type="primary" onClick={() => setModalType('novoCliente') && setModalVisible(true)}>Novo Cliente</Button>}
          >
            <Table 
              columns={[
                { title: 'Nome', dataIndex: 'nome', key: 'nome' },
                { title: 'Telefone', dataIndex: 'telefone', key: 'telefone' },
                { title: 'E-mail', dataIndex: 'email', key: 'email' },
                { title: 'Total Compras', dataIndex: 'totalCompras', key: 'totalCompras' },
                { 
                  title: 'Ações', 
                  key: 'actions', 
                  render: () => (
                    <Space size="middle">
                      <Button type="primary" size="small">Editar</Button>
                      <Button type="primary" danger size="small">Excluir</Button>
                    </Space>
                  )
                },
              ]}
              dataSource={clientes}
            />
          </Card>
        );
      
      case 'ranking':
        return (
          <Card title="Ranking de Atendimentos">
            <Table 
              columns={[
                { title: 'Funcionário', dataIndex: 'funcionario', key: 'funcionario' },
                { title: 'Atendimentos', dataIndex: 'atendimentos', key: 'atendimentos' },
                { title: 'Valor Total', dataIndex: 'valorTotal', key: 'valorTotal', render: val => `R$ ${val.toFixed(2)}` },
              ]}
              dataSource={rankingAtendimentos}
            />
          </Card>
        );
      
      case 'estoque':
        return (
          <Card 
            title="Controle de Estoque" 
            extra={<Button type="primary" onClick={() => setModalType('novoProduto') && setModalVisible(true)}>Novo Produto</Button>}
          >
            <Table 
              columns={[
                { title: 'Produto', dataIndex: 'produto', key: 'produto' },
                { title: 'Categoria', dataIndex: 'categoria', key: 'categoria' },
                { title: 'Quantidade', dataIndex: 'quantidade', key: 'quantidade' },
                { title: 'Valor Unitário', dataIndex: 'valorUnitario', key: 'valorUnitario', render: val => `R$ ${val.toFixed(2)}` },
                { 
                  title: 'Ações', 
                  key: 'actions', 
                  render: () => (
                    <Space size="middle">
                      <Button type="primary" size="small">Editar</Button>
                      <Button type="primary" danger size="small">Excluir</Button>
                    </Space>
                  )
                },
              ]}
              dataSource={produtosEstoque}
            />
          </Card>
        );
      
      case 'negocio':
        return (
          <Card title="Meu Negócio">
            <Form layout="vertical">
              <Form.Item label="Nome do Estabelecimento">
                <Input placeholder="Restaurante Delícia" />
              </Form.Item>
              <Form.Item label="CNPJ">
                <Input placeholder="00.000.000/0000-00" />
              </Form.Item>
              <Form.Item label="Endereço">
                <Input placeholder="Av. Principal, 1234" />
              </Form.Item>
              <Form.Item label="Telefone">
                <Input placeholder="(11) 9999-9999" />
              </Form.Item>
              <Form.Item label="Horário de Funcionamento">
                <Input placeholder="Seg-Sex: 11h-23h, Sáb-Dom: 12h-24h" />
              </Form.Item>
              <Button type="primary">Salvar Configurações</Button>
            </Form>
          </Card>
        );
      
      case 'financeiro':
        return (
          <div>
            <Card title="Resumo Financeiro" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Statistic title="Receita do Mês" value={financeiroResumo.receitaMes} precision={2} prefix="R$" />
                <Statistic title="Despesas do Mês" value={financeiroResumo.despesasMes} precision={2} prefix="R$" />
                <Statistic title="Lucro do Mês" value={financeiroResumo.lucroMes} precision={2} prefix="R$" />
                <Statistic title="Ticket Médio" value={financeiroResumo.ticketMedio} precision={2} prefix="R$" />
              </div>
            </Card>
            
            <Card title="Relatórios">
              <Form layout="inline">
                <Form.Item label="Período">
                  <RangePicker />
                </Form.Item>
                <Form.Item label="Tipo de Relatório">
                  <Select defaultValue="vendas" style={{ width: 200 }}>
                    <Option value="vendas">Vendas</Option>
                    <Option value="despesas">Despesas</Option>
                    <Option value="lucro">Lucro</Option>
                  </Select>
                </Form.Item>
                <Button type="primary">Gerar Relatório</Button>
              </Form>
            </Card>
          </div>
        );
      
      case 'dre':
        return (
          <Card title="Resumo DRE">
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
              <Statistic title="Receita Anual" value={dreResumo.receitaAnual} precision={2} prefix="R$" />
              <Statistic title="Custos" value={dreResumo.custos} precision={2} prefix="R$" />
              <Statistic title="Despesas" value={dreResumo.despesas} precision={2} prefix="R$" />
              <Statistic title="Lucro" value={dreResumo.lucro} precision={2} prefix="R$" />
            </div>
            
            <Button type="primary">Gerar DRE Completo</Button>
          </Card>
        );
      
      default:
        return <div>Selecione uma opção no menu</div>;
    }
  };

  const renderModal = () => {
    switch (modalType) {
      case 'abrirCaixa':
        return (
          <Form layout="vertical">
            <Form.Item label="Valor Inicial" required>
              <Input prefix="R$" type="number" />
            </Form.Item>
            <Form.Item label="Responsável" required>
              <Input />
            </Form.Item>
            <Form.Item label="Observações">
              <TextArea rows={3} />
            </Form.Item>
          </Form>
        );
      
      case 'fecharCaixa':
        return (
          <Form layout="vertical">
            <Form.Item label="Valor Final" required>
              <Input prefix="R$" type="number" />
            </Form.Item>
            <Form.Item label="Responsável" required>
              <Input />
            </Form.Item>
            <Form.Item label="Observações">
              <TextArea rows={3} />
            </Form.Item>
          </Form>
        );
      
      case 'novoCliente':
        return (
          <Form layout="vertical">
            <Form.Item label="Nome" required>
              <Input />
            </Form.Item>
            <Form.Item label="Telefone" required>
              <Input />
            </Form.Item>
            <Form.Item label="E-mail">
              <Input type="email" />
            </Form.Item>
            <Form.Item label="Endereço">
              <Input />
            </Form.Item>
          </Form>
        );
      
      case 'novoProduto':
        return (
          <Form layout="vertical">
            <Form.Item label="Nome do Produto" required>
              <Input />
            </Form.Item>
            <Form.Item label="Categoria" required>
              <Select>
                <Option value="bebidas">Bebidas</Option>
                <Option value="alimentos">Alimentos</Option>
                <Option value="outros">Outros</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Quantidade Inicial" required>
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Valor Unitário" required>
              <Input prefix="R$" type="number" />
            </Form.Item>
            <Form.Item label="Descrição">
              <TextArea rows={3} />
            </Form.Item>
          </Form>
        );
      
      default:
        return null;
    }
  };

  const handleModalOk = () => {
    if (modalType === 'abrirCaixa') {
      setCaixaAberto(true);
    } else if (modalType === 'fecharCaixa') {
      setCaixaAberto(false);
    }
    setModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu 
          theme="dark" 
          defaultSelectedKeys={['caixa']} 
          mode="inline"
          onClick={({ key }) => setActiveMenu(key)}
        >
          <Menu.Item key="caixa" icon={<DollarOutlined />}>
            Controle de Caixa
          </Menu.Item>
          <Menu.Item key="mesas" icon={<ShopOutlined />}>
            Mesas
          </Menu.Item>
          <Menu.Item key="deliverys" icon={<ShoppingCartOutlined />}>
            Deliverys
          </Menu.Item>
          <Menu.Item key="clientes" icon={<TeamOutlined />}>
            Clientes
          </Menu.Item>
          <Menu.Item key="ranking" icon={<StarOutlined />}>
            Ranking
          </Menu.Item>
          <Menu.Item key="estoque" icon={<InboxOutlined />}>
            Estoque
          </Menu.Item>
          <Menu.Item key="negocio" icon={<FolderOpenOutlined />}>
            Meu Negócio
          </Menu.Item>
          <Menu.Item key="financeiro" icon={<PieChartOutlined />}>
            Financeiro
          </Menu.Item>
          <Menu.Item key="dre" icon={<BarChartOutlined />}>
            DRE
          </Menu.Item>
          <Menu.Item key="sair" icon={<LogoutOutlined />} style={{ marginTop: 'auto' }}>
            Sair
          </Menu.Item>
        </Menu>
      </Sider>
      
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, color: '#fff' }}>
          <h1 style={{ marginLeft: 16 }}>Sistema de Vendas - Dashboard</h1>
        </Header>
        
        <Content style={{ margin: '16px' }}>
          {renderContent()}
        </Content>
      </Layout>
      
      <Modal
        title={
          modalType === 'abrirCaixa' ? 'Abrir Caixa' :
          modalType === 'fecharCaixa' ? 'Fechar Caixa' :
          modalType === 'novoCliente' ? 'Novo Cliente' :
          modalType === 'novoProduto' ? 'Novo Produto' : ''
        }
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        {renderModal()}
      </Modal>
    </Layout>
  );
};

export default AdminDashboard;