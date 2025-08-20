import React, { useState } from 'react';
import { Card, Button, Table, Empty, Modal, Form, Select, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const MesasPage = () => {
  const [mesasAbertas, setMesasAbertas] = useState([
    { key: '1', numero: '1', clientes: 2, total: 45.00, tempo: '10 min', produtos: [] },
    { key: '2', numero: '2', clientes: 4, total: 72.50, tempo: '20 min', produtos: [] },
  ]);

  const [mesasFechadas, setMesasFechadas] = useState([
    { key: '3', numero: '3', clientes: 3, total: 100.00, data: '22/06/2025 20:30' },
    { key: '4', numero: '4', clientes: 2, total: 80.00, data: '22/06/2025 19:10' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [produtoMesa, setProdutoMesa] = useState({ produtoId: '', qtd: 1 });

  const produtos = [
    { cod: '1', nome: 'Hambúrguer', preco: 25.00 },
    { cod: '2', nome: 'Refrigerante', preco: 8.00 },
    { cod: '3', nome: 'Batata Frita', preco: 15.00 },
  ];

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const confirmarFechamentoMesa = (mesa) => {
    Modal.confirm({
      title: 'Fechar Mesa',
      content: `Deseja realmente fechar a Mesa ${mesa.numero}?`,
      onOk: () => {
        const novaMesaFechada = {
          ...mesa,
          data: new Date().toLocaleString(),
          key: Date.now().toString()
        };
        setMesasFechadas([novaMesaFechada, ...mesasFechadas]);
        setMesasAbertas(mesasAbertas.filter(m => m.key !== mesa.key));
      }
    });
  };

  return (
    <div>
      <Card 
        title="Mesas em Aberto" 
        style={{ marginBottom: 20 }}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              const novaMesa = {
                key: Date.now().toString(),
                numero: (mesasAbertas.length + 1).toString(),
                clientes: 0,
                total: 0,
                tempo: '0 min',
                produtos: []
              };
              setMesasAbertas([...mesasAbertas, novaMesa]);
            }}
          >
            Nova Mesa
          </Button>
        }
      >
        {mesasAbertas.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {mesasAbertas.map(mesa => (
              <Card
                key={mesa.key}
                title={`Mesa ${mesa.numero}`}
                extra={<span>{mesa.tempo}</span>}
                style={{ width: 200, cursor: 'pointer' }}
                actions={[
                  <EditOutlined key="edit" onClick={(e) => {
                    e.stopPropagation();
                    setMesaSelecionada(mesa);
                    setModalType('editarMesa');
                    setModalVisible(true);
                  }} />,
                  <DeleteOutlined key="delete" onClick={(e) => {
                    e.stopPropagation();
                    confirmarFechamentoMesa(mesa);
                  }} />
                ]}
                onClick={() => {
                  setMesaSelecionada(mesa);
                  setModalType('detalhesMesa');
                  setModalVisible(true);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Clientes:</span>
                  <span>{mesa.clientes}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span>Total:</span>
                  <span>{formatarMoeda(mesa.total)}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="Nenhuma mesa aberta no momento" />
        )}
      </Card>

      <Card title="Mesas Fechadas (Últimas 24h)" style={{ marginTop: 20 }}>
        {mesasFechadas.length > 0 ? (
          <Table
            columns={[
              { title: 'Mesa', dataIndex: 'numero', key: 'numero' },
              { title: 'Clientes', dataIndex: 'clientes', key: 'clientes' },
              { title: 'Total', dataIndex: 'total', key: 'total', render: (value) => formatarMoeda(value) },
              { title: 'Data/Hora', dataIndex: 'data', key: 'data' },
            ]}
            dataSource={mesasFechadas}
            rowKey="key"
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <Empty description="Nenhuma mesa fechada nas últimas 24 horas" />
        )}
      </Card>

      <Modal
        title={`Detalhes da Mesa ${mesaSelecionada?.numero}`}
        visible={modalVisible && modalType === 'detalhesMesa'}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {mesaSelecionada && (
          <div>
            <p><strong>Número:</strong> {mesaSelecionada.numero}</p>
            <p><strong>Clientes:</strong> {mesaSelecionada.clientes}</p>
            <p><strong>Total:</strong> {formatarMoeda(mesaSelecionada.total)}</p>
            <p><strong>Tempo:</strong> {mesaSelecionada.tempo}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MesasPage;