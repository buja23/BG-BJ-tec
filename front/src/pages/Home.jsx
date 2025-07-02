/* CODIGO INDEX.JSX */

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Statistic, Table, Tag, Space, Button, Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';
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
  LogoutOutlined,
  TagOutlined // Corrigido: importação do ícone de cupom
} from '@ant-design/icons';
import {
  fetchProdutos,
  createProduto,
  updateProduto,
  deleteProduto
} from '../services/produtoService';
import { aplicarCupomEmMesa, fetchCupons, createCupom, updateCupom, deleteCupom } from '../services/cupomService';
import { updateUsuario, deleteUsuario, createUsuario, fetchUsuarios } from '../services/usuarioService';
import { fetchMesas, abrirMesa, adicionarProdutoMesa, fecharMesa, detalharMesa, removerMesa } from '../services/mesaService';
import moment from 'moment';

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('caixa');
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

  // MESAS
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [produtoMesa, setProdutoMesa] = useState({ produtoId: '', qtd: 1 });

  //ESTOQUE PRODUTOS
  const [cod, setCod] = useState('');
  const [produtos, setProdutos] = useState([]);

  // CLIENTES FUNCIONAIS
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [clienteForm] = Form.useForm();

  const [form] = Form.useForm();

  // PRODUTOS FUNCIONAIS
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [produtoForm] = Form.useForm();

  // MESAS
  const [mesasAbertas, setMesasAbertas] = useState([]);
  const [mesasFechadas, setMesasFechadas] = useState([]);

  // CUPONS
  const [cupons, setCupons] = useState([]);
  const [cupomSelecionado, setCupomSelecionado] = useState(null);
  const [cupomForm] = Form.useForm();

  // Estado para cupom em mesa
  const [cupomMesaModal, setCupomMesaModal] = useState(false);
  const [cupomMesaCodigo, setCupomMesaCodigo] = useState('');
  const [mesaCupomSelecionada, setMesaCupomSelecionada] = useState(null);

   useEffect(() => {
    fetchProdutos()
      .then(produtos => {
        setProdutos(produtos);
        gerarCod(produtos);
      })
      .catch(err => console.error('Erro ao buscar produtos:', err));
    // Buscar clientes do backend
    fetchUsuarios()
      .then(clientes => setClientes(clientes))
      .catch(err => console.error('Erro ao buscar clientes:', err));
    // Buscar mesas do backend
    fetchMesas('aberta').then(setMesasAbertas);
    fetchMesas('fechada').then(setMesasFechadas);
    // Buscar cupons do backend
    fetchCupons().then(setCupons);
  }, []);


const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const novo = await createProduto({
        cod,
        nome: values.nome,
        preco: parseFloat(values.preco),
        tipo: values.tipo,
        qtd: parseInt(values.qtd)
      });
      const novaLista = [...produtos, novo];
      setProdutos(novaLista);
      alert('Produto cadastrado com sucesso!');
      form.resetFields();
      gerarCod(novaLista);
      setModalVisible(false);
    } catch (err) {
      console.error('Erro ao criar produto:', err);
    }
  };


  const gerarCod = (lista) => {
    const ultimoCod = lista.length ? parseInt(lista[lista.length - 1].cod) : 0;
    const novoCod = (ultimoCod + 1).toString().padStart(4, '0');
    setCod(novoCod);
  };


  // Dados de exemplo
  const historicoCaixa = [
    { key: '1', data: '10/05/2023', valorInicial: 150.00, valorFinal: 1850.00, responsavel: 'João Silva' },
    { key: '2', data: '09/05/2023', valorInicial: 150.00, valorFinal: 2200.00, responsavel: 'Maria Souza' },
  ];

  // Dados simulados das mesas abertas e fechadas (só pra exemplo)
  const deliverys = [
    { key: '1', pedido: '#1001', cliente: 'Cliente E', endereco: 'Rua A, 123', valor: 95.00, status: 'Em preparo' },
    { key: '2', pedido: '#1002', cliente: 'Cliente F', endereco: 'Av. B, 456', valor: 65.50, status: 'Saiu para entrega' },
  ];

  const rankingAtendimentos = [
    { key: '1', funcionario: 'João Silva', atendimentos: 25, valorTotal: 3250.00 },
    { key: '2', funcionario: 'Maria Souza', atendimentos: 18, valorTotal: 2850.00 },
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
            <Card title="Mesas em Aberto" style={{ marginBottom: 20 }} extra={<Button type="primary" onClick={() => { setModalType('abrirMesa'); setModalVisible(true); abrirMesaForm.resetFields(); }}>Abrir Mesa</Button>}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {mesasAbertas.map(mesa => (
                  <Card
                    key={mesa._id}
                    title={mesa.mesa}
                    extra={<span>{mesa.abertoEm ? new Date(mesa.abertoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}</span>}
                    style={{ width: 220, cursor: 'pointer' }}
                    actions={[
                      <Button type="primary" size="small" onClick={e => { e.stopPropagation(); setMesaCupomSelecionada(mesa); setCupomMesaModal(true); setCupomMesaCodigo(''); }}>Aplicar Cupom</Button>,
                      <Button type="primary" size="small" danger onClick={async (e) => {
                        e.stopPropagation();
                        await fecharMesa(mesa._id);
                        fetchMesas('aberta').then(setMesasAbertas);
                        fetchMesas('fechada').then(setMesasFechadas);
                      }}>Fechar Mesa</Button>
                    ]}
                    onClick={() => {
                      setMesaSelecionada(mesa);
                      setModalType('adicionarProdutoMesa');
                      setModalVisible(true);
                    }}
                  >
                    <p><strong>Cliente:</strong> {mesa.cliente?.nome || '-'}</p>
                    <p><strong>Total:</strong> R$ {mesa.valorTotal?.toFixed(2) || '0,00'}</p>
                    {mesa.desconto > 0 && (
                      <>
                        <p style={{ color: 'green' }}><strong>Desconto:</strong> -R$ {mesa.desconto.toFixed(2)}</p>
                        <p><strong>Valor Final:</strong> R$ {(mesa.valorTotal).toFixed(2)}</p>
                      </>
                    )}
                    <p><strong>Produtos:</strong> {mesa.produtos?.length || 0}</p>
                  </Card>
                ))}
              </div>
            </Card>

            
            <Card title="Mesas Fechadas">
              <Table
                columns={[
                  { title: 'Mesa', dataIndex: 'mesa', key: 'mesa' },
                  { title: 'Cliente', dataIndex: ['cliente', 'nome'], key: 'cliente', render: (val, rec) => rec.cliente?.nome || '-' },
                  { title: 'Valor', dataIndex: 'valorTotal', key: 'valor', render: val => `R$ ${(val||0).toFixed(2)}` },
                  { title: 'Data/Hora', dataIndex: 'fechadoEm', key: 'data', render: val => val ? new Date(val).toLocaleString('pt-BR') : '-' },
                  {
                    title: 'Ações',
                    key: 'actions',
                    render: (_, record) => (
                      <Button type="primary" size="small" onClick={() => {
                        console.log(record); // Veja o que aparece no console
                        Modal.confirm({
                          title: `Detalhes da Mesa ${record.mesa}`,
                          content: (
                            <div>
                              <p><strong>Cliente:</strong> {record.cliente?.nome || '-'}</p>
                              <p><strong>Produtos:</strong></p>
                              <ul>
                                {record.produtos?.map((p, i) => (
                                  <li key={i}>{p.nome} x{p.qtd} - R$ {(p.preco * p.qtd).toFixed(2)}</li>
                                ))}
                              </ul>
                              <p><strong>Total:</strong> R$ {record.valorTotal?.toFixed(2)}</p>
                              <p><strong>Fechada em:</strong> {record.fechadoEm ? new Date(record.fechadoEm).toLocaleString('pt-BR') : '-'}</p>
                            </div>
                          ),
                        });
                      }}>Detalhes</Button>
                    )
                  },
                ]}
                dataSource={mesasFechadas.map(m => ({ ...m, key: m._id }))}
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
            extra={<Button type="primary" onClick={() => { setModalType('novoCliente'); setModalVisible(true); clienteForm.resetFields(); setClienteSelecionado(null); }}>Novo Cliente</Button>}
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
                  render: (_, record) => (
                    <Space size="middle">
                      <Button type="primary" size="small" onClick={() => {
                        setClienteSelecionado(record);
                        setModalType('editarCliente');
                        setModalVisible(true);
                        setTimeout(() => clienteForm.setFieldsValue(record), 0);
                      }}>Editar</Button>
                      <Button type="primary" danger size="small" onClick={async () => {
                        Modal.confirm({
                          title: 'Excluir Cliente',
                          content: `Tem certeza que deseja excluir ${record.nome}?`,
                          okText: 'Sim',
                          okType: 'danger',
                          cancelText: 'Não',
                          onOk: async () => {
                            await deleteUsuario(record.id);
                            setClientes(prev => prev.filter(c => c.id !== record.id));
                          }
                        });
                      }}>Excluir</Button>
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
            extra={
              <Button 
                type="primary" 
                onClick={() => {
                  setModalType('novoProduto');
                  setModalVisible(true);
                  produtoForm.resetFields();
                  setProdutoSelecionado(null);
                  gerarCod(produtos);
                }}>
                Novo Produto
              </Button>
            }
          >
            <Table 
              columns={[
                { title: 'Código', dataIndex: 'cod', key: 'cod' },
                { title: 'Produto', dataIndex: 'nome', key: 'nome' },
                { title: 'Categoria', dataIndex: 'tipo', key: 'tipo' },
                { title: 'Quantidade', dataIndex: 'qtd', key: 'qtd' },
                { title: 'Valor Unitário', dataIndex: 'preco', key: 'preco', render: val => `R$ ${val.toFixed(2)}` },
                { 
                  title: 'Ações', 
                  key: 'actions', 
                  render: (_, record) => (
                    <Space size="middle">
                      <Button type="primary" size="small" onClick={() => {
                        setProdutoSelecionado(record);
                        setModalType('editarProduto');
                        setModalVisible(true);
                        setTimeout(() => produtoForm.setFieldsValue(record), 0);
                      }}>Editar</Button>
                      <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={() => {
                          Modal.confirm({
                            title: 'Excluir Produto',
                            content: `Tem certeza que deseja excluir ${record.nome}?`,
                            okText: 'Sim',
                            okType: 'danger',
                            cancelText: 'Não',
                            onOk: () => {
                                return deleteProduto(record.cod)
                                  .then(() => setProdutos(prev => prev.filter(p => p.cod !== record.cod)))
                                  .catch(() => Modal.error({ title: 'Erro', content: 'Não foi possível excluir o produto.' }));
                              }
                          });
                        }}
                      >
                        Excluir
                      </Button>
                    </Space>
                  )
                },
              ]}
              dataSource={produtos.map((p, i) => ({ ...p, key: i }))}
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
      
      case 'cupons':
        return (
          <Card
            title="Cupons de Desconto"
            extra={<Button type="primary" onClick={() => {
              cupomForm.resetFields(); // Reset antes de abrir
              setCupomSelecionado(null);
              setModalType('novoCupom');
              setModalVisible(true);
            }}>Novo Cupom</Button>}
          >
            <Table
              columns={[
                { title: 'Código', dataIndex: 'codigo', key: 'codigo' },
                { title: 'Tipo', dataIndex: 'tipo', key: 'tipo', render: t => t === 'percentual' ? '% Desconto' : 'Valor (R$)' },
                { title: 'Valor', dataIndex: 'valor', key: 'valor', render: (v, r) => r.tipo === 'percentual' ? `${v}%` : `R$ ${v.toFixed(2)}` },
                { title: 'Validade', dataIndex: 'validade', key: 'validade', render: v => v ? new Date(v).toLocaleDateString('pt-BR') : '-' },
                { title: 'Ativo', dataIndex: 'ativo', key: 'ativo', render: v => v ? 'Sim' : 'Não' },
                { title: 'Uso Único', dataIndex: 'usoUnico', key: 'usoUnico', render: v => v ? 'Sim' : 'Não' },
                {
                  title: 'Ações',
                  key: 'actions',
                  render: (_, record) => (
                    <Space size="middle">
                      <Button type="primary" size="small" onClick={() => {
                        setCupomSelecionado(record);
                        setModalType('editarCupom');
                        setModalVisible(true);
                        setTimeout(() => cupomForm.setFieldsValue({ ...record, validade: record.validade ? moment(record.validade) : null }), 0);
                      }}>Editar</Button>
                      <Button type="primary" danger size="small" onClick={async () => {
                        Modal.confirm({
                          title: 'Excluir Cupom',
                          content: `Tem certeza que deseja excluir o cupom ${record.codigo}?`,
                          okText: 'Sim',
                          okType: 'danger',
                          cancelText: 'Não',
                          onOk: async () => {
                            await deleteCupom(record._id);
                            setCupons(prev => prev.filter(c => c._id !== record._id));
                          }
                        });
                      }}>Excluir</Button>
                    </Space>
                  )
                },
              ]}
              dataSource={cupons}
              rowKey="_id"
            />
          </Card>
        );
      
      default:
        return <div>Selecione uma opção no menu</div>;
    }
  };

  // Função para abrir nova mesa
  const [abrirMesaForm] = Form.useForm();
  const handleAbrirMesa = async (values) => {
    try {
      // Cliente pode ser string (id) ou vazio
      const payload = { mesa: values.mesa };
      if (values.cliente) payload.cliente = values.cliente;
      await abrirMesa(payload);
      fetchMesas('aberta').then(setMesasAbertas);
      abrirMesaForm.resetFields();
      setModalVisible(false);
      Modal.success({ title: 'Mesa aberta!', content: 'A mesa foi aberta com sucesso.' });
    } catch (err) {
      Modal.error({ title: 'Erro', content: 'Não foi possível abrir a mesa.' });
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
      
      case 'abrirMesa':
        return (
          <Form layout="vertical" form={abrirMesaForm} onFinish={handleAbrirMesa}>
            <Form.Item name="mesa" label="Número/Nome da Mesa" rules={[{ required: true, message: 'Informe o número ou nome da mesa' }]}> 
              <Input placeholder="Ex: 01, 02, VIP, etc." />
            </Form.Item>
            <Form.Item name="cliente" label="Cliente">
              <Select allowClear placeholder="Selecione um cliente (opcional)">
                {clientes.map(cliente => (
                  <Option key={cliente.id || cliente._id} value={cliente.id || cliente._id}>{cliente.nome}</Option>
                ))}
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">Abrir Mesa</Button>
          </Form>
        );
      
      case 'novoCliente':
      case 'editarCliente':
        return (
          <Form layout="vertical" form={clienteForm} onFinish={async () => {
            try {
              const values = await clienteForm.validateFields();
              if (modalType === 'novoCliente') {
                const novo = await createUsuario({ ...values });
                setClientes(prev => [...prev, novo]);
              } else if (modalType === 'editarCliente' && clienteSelecionado) {
                const atualizado = await updateUsuario(clienteSelecionado.id, values);
                setClientes(prev => prev.map(c => c.id === clienteSelecionado.id ? atualizado : c));
              }
              setModalVisible(false);
              setClienteSelecionado(null);
              clienteForm.resetFields();
            } catch (err) {}
          }} initialValues={clienteSelecionado || {}}>
            <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Informe o nome' }]}> <Input /> </Form.Item>
            <Form.Item name="telefone" label="Telefone" rules={[{ required: true, message: 'Informe o telefone' }]}> <Input /> </Form.Item>
            <Form.Item name="email" label="E-mail"> <Input type="email" /> </Form.Item>
            <Form.Item name="endereco" label="Endereço"> <Input /> </Form.Item>
            <Button type="primary" htmlType="submit">Salvar</Button>
          </Form>
        );

        case 'adicionarProdutoMesa':
  return (
    <Form layout="vertical" onFinish={async () => {
      if (!produtoMesa.produtoId || !mesaSelecionada) return;
      const produto = produtos.find(p => p.cod === produtoMesa.produtoId);
      if (!produto) return;
      await adicionarProdutoMesa(mesaSelecionada._id || mesaSelecionada.id || mesaSelecionada.key, {
        produtoId: produto.cod,
        nome: produto.nome,
        preco: produto.preco,
        qtd: produtoMesa.qtd
      });
      // Atualiza mesas abertas
      fetchMesas('aberta').then(setMesasAbertas);
      setModalVisible(false);
      setProdutoMesa({ produtoId: '', qtd: 1 });
    }}>
      <Form.Item label="Produto">
        <Select
          value={produtoMesa.produtoId}
          onChange={(value) => setProdutoMesa(prev => ({ ...prev, produtoId: value }))}
        >
          {produtos.map(prod => (
            <Option key={prod.cod} value={prod.cod}>{prod.nome} - R$ {prod.preco.toFixed(2)}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Quantidade">
        <Input
          type="number"
          min={1}
          value={produtoMesa.qtd}
          onChange={(e) => setProdutoMesa(prev => ({ ...prev, qtd: parseInt(e.target.value) || 1 }))}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit">Adicionar à Mesa</Button>
    </Form>
  );

      
      case 'novoProduto':
        return (
          <Form layout="vertical" form={produtoForm} onFinish={async () => {
            try {
              const values = await produtoForm.validateFields();
              const payload = {
                cod: cod,
                nome: values.nome,
                preco: parseFloat(values.preco),
                tipo: values.tipo,
                qtd: parseInt(values.qtd)
              };
              const novo = await createProduto(payload);
              setProdutos(prev => [...prev, novo]);
              setModalVisible(false);
              setProdutoSelecionado(null);
              produtoForm.resetFields();
            } catch (err) {}
          }} initialValues={{ tipo: 'comida' }}>
            <Form.Item label="Código">
              <Input value={cod} disabled />
            </Form.Item>
            <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Informe o nome' }]}> 
              <Input />
            </Form.Item>
            <Form.Item name="preco" label="Preço" rules={[{ required: true, message: 'Informe o preço' }]}> 
              <Input type="number" step="0.01" prefix="R$" />
            </Form.Item>
            <Form.Item name="tipo" label="Tipo" rules={[{ required: true, message: 'Selecione o tipo' }]}> 
              <Select>
                <Option value="lanche">Lanche</Option>
                <Option value="bebida">Bebida</Option>
                <Option value="sobremesa">Sobremesa</Option>
                <Option value="porcao">Porção</Option>
              </Select>
            </Form.Item>
            <Form.Item name="qtd" label="Quantidade" rules={[{ required: true, message: 'Informe a quantidade' }]}> 
              <Input type="number" />
            </Form.Item>
            <Button type="primary" htmlType="submit">Salvar</Button>
          </Form>
        );
      case 'editarProduto':
        return (
          <Form layout="vertical" form={produtoForm} onFinish={async () => {
            try {
              const values = await produtoForm.validateFields();
              const payload = {
                cod: produtoSelecionado.cod,
                nome: values.nome,
                preco: parseFloat(values.preco),
                tipo: values.tipo,
                qtd: parseInt(values.qtd)
              };
              const atualizado = await updateProduto(produtoSelecionado.cod, payload);
              setProdutos(prev => prev.map(p => p.cod === produtoSelecionado.cod ? atualizado : p));
              setModalVisible(false);
              setProdutoSelecionado(null);
              produtoForm.resetFields();
            } catch (err) {}
          }} initialValues={produtoSelecionado}>
            <Form.Item label="Código">
              <Input value={produtoSelecionado?.cod || ''} disabled />
            </Form.Item>
            <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Informe o nome' }]}> 
              <Input />
            </Form.Item>
            <Form.Item name="preco" label="Preço" rules={[{ required: true, message: 'Informe o preço' }]}> 
              <Input type="number" step="0.01" prefix="R$" />
            </Form.Item>
            <Form.Item name="tipo" label="Tipo" rules={[{ required: true, message: 'Selecione o tipo' }]}> 
              <Select>
                <Option value="lanche">Lanche</Option>
                <Option value="bebida">Bebida</Option>
                <Option value="sobremesa">Sobremesa</Option>
                <Option value="porcao">Porção</Option>
              </Select>
            </Form.Item>
            <Form.Item name="qtd" label="Quantidade" rules={[{ required: true, message: 'Informe a quantidade' }]}> 
              <Input type="number" />
            </Form.Item>
            <Button type="primary" htmlType="submit">Salvar</Button>
          </Form>
        );
      case 'novoCupom':
      case 'editarCupom': {
        const initialCupomValues = cupomSelecionado
          ? {
              ...cupomSelecionado,
              validade: cupomSelecionado.validade ? moment(cupomSelecionado.validade) : null,
              valor: typeof cupomSelecionado.valor === 'number' ? cupomSelecionado.valor : null
            }
          : { tipo: 'percentual', ativo: true, usoUnico: false, valor: null };
        return (
          <Form layout="vertical" form={cupomForm} initialValues={initialCupomValues} onFinish={async () => {
            try {
              const values = await cupomForm.validateFields();
              const payload = {
                ...values,
                validade: values.validade ? values.validade.toDate() : null
              };
              if (modalType === 'novoCupom') {
                const novo = await createCupom(payload);
                setCupons(prev => [...prev, novo]);
              } else if (modalType === 'editarCupom' && cupomSelecionado) {
                const atualizado = await updateCupom(cupomSelecionado._id, payload);
                setCupons(prev => prev.map(c => c._id === cupomSelecionado._id ? atualizado : c));
              }
              setModalVisible(false);
              setCupomSelecionado(null);
              setTimeout(() => cupomForm.resetFields(), 300); // Reset só depois de fechar
            } catch (err) {}
          }}>
            <Form.Item name="codigo" label="Código" rules={[{ required: true, message: 'Informe o código do cupom' }]}> 
              <Input autoFocus />
            </Form.Item>
            <Form.Item name="tipo" label="Tipo" rules={[{ required: true, message: 'Selecione o tipo' }]}> 
              <Select>
                <Option value="percentual">% Desconto</Option>
                <Option value="valor">Valor (R$)</Option>
              </Select>
            </Form.Item>
            <Form.Item name="valor" label="Valor" rules={[{ required: true, type: 'number', message: 'Informe o valor' }]}> 
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="validade" label="Validade"> 
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="ativo" label="Ativo"> 
              <Select>
                <Option value={true}>Sim</Option>
                <Option value={false}>Não</Option>
              </Select>
            </Form.Item>
            <Form.Item name="usoUnico" label="Uso Único"> 
              <Select>
                <Option value={true}>Sim</Option>
                <Option value={false}>Não</Option>
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">Salvar</Button>
          </Form>
        );
      }
      
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


  const handleEditarCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setModalType('editarCliente');
    setModalVisible(true);
    setTimeout(() => {
      clienteForm.setFieldsValue(cliente);
    }, 0);
  };

  const handleExcluirCliente = (cliente) => {
    Modal.confirm({
      title: 'Excluir Cliente',
      content: `Tem certeza que deseja excluir ${cliente.nome}?`,
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        setClientes(prev => prev.filter(c => c.key !== cliente.key));
      }
    });
  };

  const handleSalvarCliente = async () => {
    try {
      const values = await clienteForm.validateFields();
      if (modalType === 'novoCliente') {
        const novo = { ...values, key: Date.now().toString(), totalCompras: 0 };
        setClientes(prev => [...prev, novo]);
      } else if (modalType === 'editarCliente' && clienteSelecionado) {
        setClientes(prev => prev.map(c => c.key === clienteSelecionado.key ? { ...c, ...values } : c));
      }
      setModalVisible(false);
      setClienteSelecionado(null);
      clienteForm.resetFields();
    } catch (err) {
      // erro de validação
    }
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
          <Menu.Item key="cupons" icon={<TagOutlined />}>
            Cupons
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
          modalType === 'editarCliente' ? 'Editar Cliente' :
          modalType === 'novoProduto' ? 'Novo Produto' :
          modalType === 'editarProduto' ? 'Editar Produto' :
          modalType === 'novoCupom' ? 'Novo Cupom' :
          modalType === 'editarCupom' ? 'Editar Cupom' : ''
        }
        visible={modalVisible}
        onOk={
          (modalType === 'abrirCaixa' || modalType === 'fecharCaixa') ? handleModalOk : undefined
        }
        onCancel={() => {
          setModalVisible(false);
          setProdutoSelecionado(null);
          produtoForm.resetFields();
          setClienteSelecionado(null);
          clienteForm.resetFields();
          abrirMesaForm.resetFields();
          cupomForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        {renderModal()}
      </Modal>

      {/* Modal para aplicar cupom em mesa */}
      {cupomMesaModal && mesaCupomSelecionada && (
        <Modal
          title={`Aplicar Cupom na Mesa ${mesaCupomSelecionada?.mesa || ''}`}
          visible={cupomMesaModal}
          onCancel={() => { setCupomMesaModal(false); setMesaCupomSelecionada(null); setCupomMesaCodigo(''); }}
          footer={[
            <Button key="cancel" onClick={() => { setCupomMesaModal(false); setMesaCupomSelecionada(null); setCupomMesaCodigo(''); }}>
              Cancelar
            </Button>,
            <Button key="apply" type="primary" onClick={async () => {
              if (!cupomMesaCodigo) return Modal.warning({ title: 'Informe o código do cupom' });
              try {
                await aplicarCupomEmMesa({ id: mesaCupomSelecionada?._id, codigo: cupomMesaCodigo });
                fetchMesas('aberta').then(setMesasAbertas);
                setCupomMesaModal(false);
                setMesaCupomSelecionada(null);
                setCupomMesaCodigo('');
                Modal.success({ title: 'Cupom aplicado!', content: 'O desconto foi aplicado à mesa.' });
              } catch (err) {
                Modal.error({ title: 'Erro', content: err?.response?.data?.error || 'Não foi possível aplicar o cupom.' });
              }
            }}>
              Aplicar
            </Button>
          ]}
        >
          <Input
            placeholder="Código do cupom"
            value={cupomMesaCodigo}
            onChange={e => setCupomMesaCodigo(e.target.value)}
            onPressEnter={async () => {
              if (!cupomMesaCodigo) return;
              try {
                await aplicarCupomEmMesa({ id: mesaCupomSelecionada?._id, codigo: cupomMesaCodigo });
                fetchMesas('aberta').then(setMesasAbertas);
                setCupomMesaModal(false);
                setMesaCupomSelecionada(null);
                setCupomMesaCodigo('');
                Modal.success({ title: 'Cupom aplicado!', content: 'O desconto foi aplicado à mesa.' });
              } catch (err) {
                Modal.error({ title: 'Erro', content: err?.response?.data?.error || 'Não foi possível aplicar o cupom.' });
              }
            }}
            maxLength={20}
            autoFocus
          />
        </Modal>
      )}
    </Layout>
  );
};


export default Home;