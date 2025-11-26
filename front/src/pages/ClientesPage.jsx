import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Space, message, Popconfirm, Divider, Row, Col, Typography, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { fetchClientes, createCliente, updateCliente, deleteCliente } from '../services/clienteService';
import axios from 'axios'; // Importa o axios para a chamada da API ViaCEP

const ClientesPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const { Title } = Typography; // Extrai o componente Title

  const [editingCliente, setEditingCliente] = useState(null);
  const [form] = Form.useForm();

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const data = await fetchClientes();
      setClientes(data);
    } catch (error) {
      message.error('Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleOpenModal = (cliente = null) => {
    setEditingCliente(cliente);
    // Se estiver editando, preenche todos os campos, incluindo o endereço
    if (cliente) {
      form.setFieldsValue({ ...cliente, ...cliente.endereco });
    }
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingCliente(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      // Agrupa os dados de endereço em um objeto aninhado
      const clienteData = {
        nome: values.nome,
        telefone: values.telefone,
        cpf: values.cpf,
        endereco: {
          cep: values.cep,
          logradouro: values.logradouro,
          numero: values.numero,
          complemento: values.complemento,
          bairro: values.bairro,
          cidade: values.cidade,
          uf: values.uf,
        }
      };

      if (editingCliente) {
        await updateCliente(editingCliente._id, clienteData);
        message.success('Cliente atualizado com sucesso!');
      } else {
        await createCliente(clienteData);
        message.success('Cliente criado com sucesso!');
      }
      handleCancel();
      carregarClientes();
    } catch (error) {
      message.error(error.response?.data?.message || 'Erro ao salvar cliente.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCliente(id);
      message.success('Cliente deletado com sucesso!');
      carregarClientes();
    } catch (error) {
      message.error(error.response?.data?.message || 'Erro ao deletar cliente.');
    }
  };

  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length !== 8) {
      return;
    }

    setCepLoading(true);
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (data.erro) {
        message.error('CEP não encontrado.');
        form.setFieldsValue({ logradouro: '', bairro: '', cidade: '', uf: '' });
      } else {
        // Preenche os campos do formulário com os dados retornados
        form.setFieldsValue({
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
        });
        message.success('Endereço preenchido automaticamente!');
      }
    } catch (error) {
      message.error('Erro ao buscar CEP.');
    } finally {
      setCepLoading(false);
    }
  };

  return (
    <div>
      <Card 
        title="Lista de Clientes" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Novo Cliente
          </Button>
        }
      >
        <Table 
          columns={[
            { title: 'Nome', dataIndex: 'nome', key: 'nome' },
            { title: 'Telefone', dataIndex: 'telefone', key: 'telefone' },
            { title: 'CPF', dataIndex: 'cpf', key: 'cpf' },
            { 
              title: 'Ações', 
              key: 'actions', 
              render: (_, record) => (
                <Space size="middle">
                  <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleOpenModal(record)}>
                    Editar
                  </Button>
                  <Popconfirm
                    title="Tem certeza que deseja excluir este cliente?"
                    onConfirm={() => handleDelete(record._id)}
                  >
                    <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                      Excluir
                    </Button>
                  </Popconfirm>
                </Space>
              )
            },
          ]}
          dataSource={clientes.map(c => ({ ...c, key: c._id }))}
          loading={loading}
        />
      </Card>

      <Modal
        title={editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText="Salvar"
        cancelText="Cancelar"
        width={800} // Aumenta a largura do modal
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Title level={5}>Dados Pessoais</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Nome Completo" name="nome" rules={[{ required: true, message: 'O nome é obrigatório.' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Telefone" name="telefone" rules={[{ required: true, message: 'O telefone é obrigatório.' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="CPF" name="cpf" rules={[{ required: true, message: 'O CPF é obrigatório.' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Title level={5}>Endereço</Title>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="CEP" name="cep">
                <Input onBlur={handleCepBlur} placeholder="Digite o CEP" suffix={cepLoading && <Spin size="small" />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Logradouro (Rua, Av.)" name="logradouro">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Número" name="numero">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Complemento" name="complemento">
                <Input placeholder="Apto, Bloco, etc." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Bairro" name="bairro">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Cidade" name="cidade">
                <Input />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item label="UF" name="uf">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientesPage;