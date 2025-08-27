import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const EstoquePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [produtos, setProdutos] = useState([
    { key: '1', cod: '0001', nome: 'Hambúrguer', tipo: 'lanche', qtd: 50, preco: 25.00 },
    { key: '2', cod: '0002', nome: 'Refrigerante', tipo: 'bebida', qtd: 100, preco: 8.00 },
    { key: '3', cod: '0003', nome: 'Batata Frita', tipo: 'porcao', qtd: 30, preco: 15.00 },
  ]);

  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const novoProduto = {
      key: Date.now().toString(),
      cod: (produtos.length + 1).toString().padStart(4, '0'),
      ...values,
      qtd: parseInt(values.qtd),
      preco: parseFloat(values.preco)
    };
    setProdutos([...produtos, novoProduto]);
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Card 
        title="Controle de Estoque" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
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
              render: () => (
                <Space size="middle">
                  <Button type="primary" size="small">Editar</Button>
                  <Button type="primary" danger size="small">Excluir</Button>
                </Space>
              )
            },
          ]}
          dataSource={produtos}
        />
      </Card>

      <Modal
        title="Novo Produto"
        visible={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Nome" name="nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Preço" name="preco" rules={[{ required: true }]}>
            <Input type="number" step="0.01" prefix="R$" />
          </Form.Item>
          <Form.Item label="Tipo" name="tipo" rules={[{ required: true }]}>
            <Select>
              <Option value="lanche">Lanche</Option>
              <Option value="bebida">Bebida</Option>
              <Option value="sobremesa">Sobremesa</Option>
              <Option value="porcao">Porção</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Quantidade" name="qtd" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EstoquePage;