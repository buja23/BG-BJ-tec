import React from 'react';
import { Card, Table, Tag, Space, Button } from 'antd';

const DeliverysPage = () => {
  const deliverys = [
    { key: '1', pedido: '#1001', cliente: 'Cliente E', endereco: 'Rua A, 123', valor: 95.00, status: 'Em preparo' },
    { key: '2', pedido: '#1002', cliente: 'Cliente F', endereco: 'Av. B, 456', valor: 65.50, status: 'Saiu para entrega' },
  ];

  return (
    <Card 
      title="Pedidos de Delivery"
      extra={<Button type="primary">Novo Pedido</Button>}
    >
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
};

export default DeliverysPage;