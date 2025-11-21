// src/pages/MesasPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, message, Typography, Row, Col, Modal, Form, Input, Badge, Statistic, Space } from 'antd';
import { PlusOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getMesas, abrirMesa } from '../services/mesaService';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { Title, Text } = Typography; // Manter a desestruturação aqui é comum, mas vamos corrigir o uso.

const MesasPage = () => {
  const [form] = Form.useForm();
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const carregarDados = async () => {
    try {
      setLoading(true);
      const mesasData = await getMesas();
      setMesas(mesasData);
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
    navigate(`/app/mesas/${mesa._id}`);
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
                  <Card hoverable onClick={() => handleMesaClick(mesa)} bodyStyle={{ padding: '16px', textAlign: 'center' }}>
                    <Title level={2} style={{ margin: 0 }}>{mesa.numero}</Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <ClockCircleOutlined /> Aberta há {formatDistanceToNow(new Date(mesa.dataAbertura), { locale: ptBR })}
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
    </Spin>
  );
};

export default MesasPage;
