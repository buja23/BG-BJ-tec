import React, { useState, useEffect } from 'react';
import { Card, Statistic, Table, Button, Modal, Form, Input, message, Row, Col, Spin, Tag } from 'antd';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { getStatusCaixa, getHistoricoCaixa, abrirCaixa, fecharCaixa } from '../services/caixaService.js';
import { format } from 'date-fns';

const CaixaPage = () => {
  const { usuario } = useUsuario();
  const [form] = Form.useForm();

  const [statusCaixa, setStatusCaixa] = useState({ status: 'fechado' });
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [status, historicoData] = await Promise.all([getStatusCaixa(), getHistoricoCaixa()]);
      setStatusCaixa(status);
      setHistorico(historicoData);
    } catch (error) {
      message.error('Erro ao carregar dados do caixa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleAcaoCaixa = async (values) => {
    const dados = { ...values, responsavelAbertura: usuario.nome, responsavelFechamento: usuario.nome };
    try {
      if (modalType === 'abrirCaixa') {
        await abrirCaixa(dados);
        message.success('Caixa aberto com sucesso!');
      } else {
        await fecharCaixa(dados);
        message.success('Caixa fechado com sucesso!');
      }
      setModalVisible(false);
      form.resetFields();
      carregarDados(); // Recarrega os dados após a ação
    } catch (error) {
      message.error(error.response?.data?.message || 'Erro ao processar ação.');
    }
  };

  return (
    <Spin spinning={loading}>
      <div>
        <Card title="Controle de Caixa" style={{ marginBottom: 20 }}>
          {statusCaixa.status === 'aberto' ? (
            <>
              <Row gutter={16}>
                <Col span={8}><Statistic title="Valor de Abertura" value={statusCaixa.caixa.valorAbertura} precision={2} prefix="R$" /></Col>
                <Col span={8}><Statistic title="Vendas no Período" value={statusCaixa.totalVendas} precision={2} prefix="R$" /></Col>
                <Col span={8}><Statistic title="Saldo Esperado" value={statusCaixa.saldoEsperado} precision={2} prefix="R$" /></Col>
              </Row>
              <Button type="primary" danger style={{ marginTop: 24 }} onClick={() => { setModalType('fecharCaixa'); setModalVisible(true); }}>
                Fechar Caixa
              </Button>
            </>
          ) : (
            <>
              <p>O caixa está fechado.</p>
              <Button type="primary" onClick={() => { setModalType('abrirCaixa'); setModalVisible(true); }}>
                Abrir Caixa
              </Button>
            </>
          )}
        </Card>
        
        <Card title="Histórico de Caixa">
          <Table 
            dataSource={historico}
            rowKey="_id"
            columns={[
              { title: 'Data Abertura', dataIndex: 'dataAbertura', key: 'dataAbertura', render: (data) => format(new Date(data), 'dd/MM/yyyy HH:mm') },
              { title: 'Abertura (R$)', dataIndex: 'valorAbertura', key: 'valorAbertura', render: val => val.toFixed(2) },
              { title: 'Vendas (R$)', dataIndex: 'totalVendas', key: 'totalVendas', render: val => val.toFixed(2) },
              { title: 'Fechamento (R$)', dataIndex: 'valorFechamento', key: 'valorFechamento', render: val => val.toFixed(2) },
              { 
                title: 'Diferença (R$)', 
                dataIndex: 'diferenca', 
                key: 'diferenca', 
                render: val => <Tag color={val < 0 ? 'red' : 'green'}>{val.toFixed(2)}</Tag> 
              },
              { title: 'Responsável Abertura', dataIndex: 'responsavelAbertura', key: 'responsavelAbertura' },
              { title: 'Responsável Fechamento', dataIndex: 'responsavelFechamento', key: 'responsavelFechamento' },
            ]}
          />
        </Card>

        <Modal
          title={modalType === 'abrirCaixa' ? 'Abrir Caixa' : 'Fechar Caixa'}
          open={modalVisible}
          onOk={() => form.submit()}
          onCancel={() => { setModalVisible(false); form.resetFields(); }}
          okText={modalType === 'abrirCaixa' ? 'Abrir' : 'Fechar'}
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical" onFinish={handleAcaoCaixa}>
            <Form.Item 
              label={modalType === 'abrirCaixa' ? 'Valor Inicial' : 'Valor Final Contado'} 
              name={modalType === 'abrirCaixa' ? 'valorAbertura' : 'valorFechamento'}
              rules={[{ required: true, message: 'Este campo é obrigatório' }]}
            >
              <Input prefix="R$" type="number" step="0.01" />
            </Form.Item>
            <Form.Item label="Responsável" initialValue={usuario?.nome} required>
              <Input disabled />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default CaixaPage;