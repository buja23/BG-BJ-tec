import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const ClientesPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [clientes, setClientes] = useState([
    { key: '1', nome: 'Cliente A', telefone: '(11) 9999-9999', email: 'cliente@email.com', totalCompras: 5 },
    { key: '2', nome: 'Cliente B', telefone: '(11) 8888-8888', email: 'cliente2@email.com', totalCompras: 3 },
  ]);

  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const novoCliente = {
      key: Date.now().toString(),
      ...values,
      totalCompras: 0
    };
    setClientes([...clientes, novoCliente]);
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Card 
        title="Lista de Clientes" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Novo Cliente
          </Button>
        }
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

      <Modal
        title="Novo Cliente"
        visible={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Nome" name="nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Telefone" name="telefone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="E-mail" name="email" rules={[{ type: 'email' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientesPage;