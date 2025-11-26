// src/pages/MesasPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, message, Typography, Row, Col, Modal, Form, Input, Badge, Statistic, Space, Select } from 'antd';
import { PlusOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getMesas, abrirMesa, abrirMesaEspecifica } from '../services/mesaService'; // 1. Importar a função correta
import { useNavigate } from 'react-router-dom';
import { fetchClientes } from '../services/clienteService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { Title, Text } = Typography;

const MesasPage = () => {
  const [form] = Form.useForm();
  const [mesas, setMesas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [vincularModalVisible, setVincularModalVisible] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState(null);
  const navigate = useNavigate();

  const carregarDados = async () => {
    try {
      setLoading(true);
      // Carrega mesas e clientes em paralelo para otimizar
      const [mesasData, clientesData] = await Promise.all([getMesas(), fetchClientes()]);
      setMesas(mesasData);
      setClientes(clientesData);
    } catch (error) {
      message.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCriarMesa = async (values) => {
    try {
      await abrirMesa(values.numero);
      message.success('Nova mesa criada com sucesso!');
      await carregarDados();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Erro ao criar nova mesa.');
    }
  };

  const handleMesaClick = (mesa) => {
    if (mesa.status === 'aberta') {
      navigate(`/app/mesas/${mesa._id}`);
    } else {
      // Se a mesa está disponível, abre o modal para vincular cliente
      setMesaSelecionada(mesa);
      setVincularModalVisible(true);
    }
  };

  const handleAbrirMesaComCliente = async () => {
    if (!mesaSelecionada) return;
    try {
      // 2. Chamar a função correta: abrirMesaEspecifica
      await abrirMesaEspecifica(mesaSelecionada._id, clienteSelecionadoId);
      message.success(`Mesa ${mesaSelecionada.numero} aberta e vinculada ao cliente!`);
      setVincularModalVisible(false);
      setClienteSelecionadoId(null);
      navigate(`/app/mesas/${mesaSelecionada._id}`);
    } catch (error) {
      message.error(error.response?.data?.message || 'Erro ao abrir mesa com cliente.');
    }
  };

  return (
    <Spin spinning={loading}>
      <Card title="Controle de Mesas" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Adicionar Mesa
        </Button>
      }>
        <Row gutter={[16, 16]}>
          {mesas.map(mesa => (
            <Col key={mesa._id} xs={12} sm={8} md={6} lg={4}>
              {mesa.status === 'aberta' ? (
                <Badge.Ribbon text="Em uso" color="blue">
                  <Card 
                    hoverable 
                    onClick={() => handleMesaClick(mesa)} 
                    styles={{ body: { padding: '16px', textAlign: 'center' } }}
                    style={{ opacity: 0.7, cursor: 'pointer' }} // Efeito para indicar que está ocupada, mas ainda clicável
                  >
                    <Title level={4} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={mesa.cliente ? mesa.cliente.nome : `Mesa ${mesa.numero}`}>
                      {mesa.cliente ? mesa.cliente.nome : `Mesa ${mesa.numero}`}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {mesa.cliente ? `Mesa ${mesa.numero}` : <ClockCircleOutlined />}
                      {!mesa.cliente && ` Aberta há ${formatDistanceToNow(new Date(mesa.dataAbertura), { locale: ptBR })}`}
                    </Text>
                    <div style={{ marginTop: '12px' }}>
                      <Statistic 
                        value={mesa.valorTotal} 
                        precision={2} 
                        prefix="R$ " 
                        valueStyle={{ fontSize: '16px' }}
                      />
                    </div>
                  </Card>
                </Badge.Ribbon>
              ) : (
                <Card 
                  hoverable 
                  onClick={() => handleMesaClick(mesa)}
                  style={{ backgroundColor: '#fafafa' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Title level={2} type="secondary" style={{ margin: 0 }}>{mesa.numero}</Title>
                    <Space direction="vertical" style={{ marginTop: 10, minHeight: 45, justifyContent: 'center' }}>
                      <Typography.Text type="secondary">
                        <CheckCircleOutlined style={{ color: 'green', marginRight: 5 }}/>
                        Disponível
                      </Typography.Text>
                    </Space>
                  </div>
                </Card>
              )}
            </Col>            
          ))}
        </Row>
      </Card>

      <Modal
        title="Adicionar Nova Mesa"
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => { setModalVisible(false); form.resetFields(); }}
        okText="Criar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleCriarMesa}>
          <Form.Item
            label="Número da Mesa"
            name="numero"
            rules={[{ required: true, message: 'Por favor, insira o número da mesa.' }]}
          >
            <Input placeholder="Ex: 01, 15, A5" />
          </Form.Item>
        </Form>
      </Modal>

      {mesaSelecionada && (
        <Modal
          title={`Abrir Mesa ${mesaSelecionada.numero}`}
          open={vincularModalVisible}
          onCancel={() => {
            setVincularModalVisible(false);
            setClienteSelecionadoId(null);
          }}
          footer={[
            <Button key="sem-cliente" onClick={() => navigate(`/app/mesas/${mesaSelecionada._id}`)}>
              Abrir sem Cliente
            </Button>,
            <Button key="com-cliente" type="primary" onClick={handleAbrirMesaComCliente} disabled={!clienteSelecionadoId}>
              Vincular Cliente e Abrir
            </Button>,
          ]}
        >
          <p>Selecione um cliente para vincular a esta mesa ou abra sem um cliente.</p>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Pesquisar e selecionar cliente..."
            optionFilterProp="children"
            onChange={(value) => setClienteSelecionadoId(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {clientes.map(cliente => (
              <Select.Option key={cliente._id} value={cliente._id}>{cliente.nome} - {cliente.cpf}</Select.Option>
            ))}
          </Select>
        </Modal>
      )}
    </Spin>
  );
};

export default MesasPage;
