import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Tag,
  Select,
  InputNumber,
  DatePicker,
  Switch
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { fetchCupons, createCupom, updateCupom, deleteCupom } from '../services/cupomService';
import dayjs from 'dayjs';

const CuponsPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cupons, setCupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCupom, setEditingCupom] = useState(null);
  const [form] = Form.useForm();

  const carregarCupons = async () => {
    try {
      setLoading(true);
      const data = await fetchCupons();
      setCupons(data);
    } catch (error) {
      message.error('Erro ao carregar cupons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCupons();
  }, []);

  const handleOpenModal = (cupom = null) => {
    setEditingCupom(cupom);
    // Converte a data para o formato que o DatePicker espera (dayjs)
    const formData = cupom ? { ...cupom, dataExpiracao: cupom.dataExpiracao ? dayjs(cupom.dataExpiracao) : null } : { ativo: true };
    form.setFieldsValue(formData);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingCupom(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const cupomData = { ...values, codigo: values.codigo.toUpperCase() };
      if (editingCupom) {
        await updateCupom(editingCupom._id, cupomData);
        message.success('Cupom atualizado com sucesso!');
      } else {
        await createCupom(cupomData);
        message.success('Cupom criado com sucesso!');
      }
      handleCancel();
      carregarCupons();
    } catch (error) {
      message.error(error.response?.data?.message || 'Erro ao salvar cupom.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCupom(id);
      message.success('Cupom deletado com sucesso!');
      carregarCupons();
    } catch (error) {
      message.error(error.response?.data?.message || 'Erro ao deletar cupom.');
    }
  };

  const columns = [
    { title: 'Código', dataIndex: 'codigo', key: 'codigo', render: (text) => <Tag color="blue">{text}</Tag> },
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
    { title: 'Valor', dataIndex: 'valor', key: 'valor', render: (val, record) => record.tipo === 'percentual' ? `${val}%` : `R$ ${val.toFixed(2)}` },
    { title: 'Status', dataIndex: 'ativo', key: 'ativo', render: (ativo) => <Tag color={ativo ? 'green' : 'red'}>{ativo ? 'Ativo' : 'Inativo'}</Tag> },
    { title: 'Expira em', dataIndex: 'dataExpiracao', key: 'dataExpiracao', render: (text) => text ? new Date(text).toLocaleDateString('pt-BR') : 'Não expira' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleOpenModal(record)}>Editar</Button>
          <Popconfirm title="Tem certeza que deseja excluir este cupom?" onConfirm={() => handleDelete(record._id)}>
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">Excluir</Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div>
      <Card title="Gerenciamento de Cupons" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Novo Cupom</Button>}>
        <Table dataSource={cupons.map(c => ({ ...c, key: c._id }))} columns={columns} loading={loading} />
      </Card>

      <Modal
        title={editingCupom ? 'Editar Cupom' : 'Novo Cupom'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ ativo: true }}>
          <Form.Item label="Código" name="codigo" rules={[{ required: true, message: 'O código é obrigatório.' }]}>
            <Input placeholder="Ex: PROMO10" />
          </Form.Item>
          <Form.Item label="Tipo de Desconto" name="tipo" rules={[{ required: true, message: 'Selecione o tipo.' }]}>
            <Select>
              <Select.Option value="percentual">Percentual (%)</Select.Option>
              <Select.Option value="fixo">Valor Fixo (R$)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Valor do Desconto" name="valor" rules={[{ required: true, message: 'O valor é obrigatório.' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item label="Data de Expiração (Opcional)" name="dataExpiracao">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item label="Status" name="ativo" valuePropName="checked">
            <Switch checkedChildren="Ativo" unCheckedChildren="Inativo" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CuponsPage;