import React, { useState } from 'react';
import { Card, Statistic, Table, Button, Modal, Form, Input, message } from 'antd';

const CaixaPage = () => {
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [valor, setValor] = useState('');
  const [responsavel, setResponsavel] = useState('');

  const historicoCaixa = [
    { key: '1', data: '10/05/2023', valorInicial: 150.00, valorFinal: 1850.00, responsavel: 'João Silva' },
    { key: '2', data: '09/05/2023', valorInicial: 150.00, valorFinal: 2200.00, responsavel: 'Maria Souza' },
  ];

  const handleAcaoCaixa = () => {
    if (!valor || !responsavel) {
      message.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (modalType === 'abrirCaixa') {
      message.success('Caixa aberto com sucesso!');
      setCaixaAberto(true);
    } else {
      message.success('Caixa fechado com sucesso!');
      setCaixaAberto(false);
    }

    setModalVisible(false);
    setValor('');
    setResponsavel('');
  };

  return (
    <div>
      <Card title="Controle de Caixa" style={{ marginBottom: 20 }}>
        {caixaAberto ? (
          <div>
            <Statistic title="Saldo Atual" value={1850.00} precision={2} prefix="R$" />
            <Button 
              type="primary" 
              danger 
              style={{ marginTop: 16 }}
              onClick={() => {
                setModalType('fecharCaixa');
                setModalVisible(true);
              }}
            >
              Fechar Caixa
            </Button>
          </div>
        ) : (
          <div>
            <p>Caixa está fechado no momento</p>
            <Button 
              type="primary" 
              onClick={() => {
                setModalType('abrirCaixa');
                setModalVisible(true);
              }}
            >
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

      <Modal
        title={modalType === 'abrirCaixa' ? 'Abrir Caixa' : 'Fechar Caixa'}
        visible={modalVisible}
        onOk={handleAcaoCaixa}
        onCancel={() => setModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label={modalType === 'abrirCaixa' ? 'Valor Inicial' : 'Valor Final'} required>
            <Input 
              prefix="R$" 
              type="number" 
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Responsável" required>
            <Input 
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CaixaPage;