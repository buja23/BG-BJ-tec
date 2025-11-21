import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { fetchProdutos, createProduto, updateProduto, deleteProduto } from '../services/produtoService';

const { Option } = Select;
const { confirm } = Modal;

const EstoquePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [editingProduto, setEditingProduto] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    carregarProdutos();
  }, []);

  // Efeito para recarregar os produtos quando a aba do navegador fica visível novamente
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Aba de estoque visível, recarregando produtos...');
        carregarProdutos();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Limpa o evento quando o componente é desmontado
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []); // O array vazio garante que o evento seja adicionado apenas uma vez

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const data = await fetchProdutos();
      setProdutos(data.map(produto => ({
        ...produto,
        key: produto._id
      })));
    } catch (error) {
      message.error('Erro ao carregar produtos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingProduto(record);
    form.setFieldsValue({
      nome: record.nome,
      preco: record.preco,
      tipo: record.tipo,
      qtd: record.qtd
    });
    setModalVisible(true);
  };

  const handleDelete = async (record) => {
    if (!record || !record._id) {
      message.error('Produto inválido para exclusão');
      return;
    }

    try {
      console.log('[Frontend] Iniciando exclusão do produto:', record);
      setLoading(true);
      
      const response = await deleteProduto(record._id);
      console.log('[Frontend] Resposta da exclusão:', response);
      
      message.success('Produto excluído com sucesso!');
      await carregarProdutos();
    } catch (error) {
      console.error('[Frontend] Erro ao excluir produto:', error);
      message.error('Erro ao excluir produto: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const produtoData = {
        ...values,
        qtd: parseInt(values.qtd),
        preco: parseFloat(values.preco)
      };

      if (editingProduto) {
        console.log('Atualizando produto:', editingProduto._id);
        const updatedProduct = await updateProduto(editingProduto._id, produtoData);
        console.log('Resposta da atualização:', updatedProduct);
        message.success('Produto atualizado com sucesso!');
      } else {
        console.log('Criando novo produto');
        const newProduct = await createProduto(produtoData);
        console.log('Resposta da criação:', newProduct);
        message.success('Produto criado com sucesso!');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingProduto(null);
      await carregarProdutos();
    } catch (error) {
      message.error('Erro ao salvar produto');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingProduto(null);
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
          loading={loading}
          columns={[
            { title: 'Código', dataIndex: 'cod', key: 'cod' },
            { title: 'Produto', dataIndex: 'nome', key: 'nome' },
            { 
              title: 'Categoria', 
              dataIndex: 'tipo', 
              key: 'tipo',
              render: (tipo) => tipo.charAt(0).toUpperCase() + tipo.slice(1)
            },
            { title: 'Quantidade', dataIndex: 'qtd', key: 'qtd' },
            { 
              title: 'Valor Unitário', 
              dataIndex: 'preco', 
              key: 'preco', 
              render: val => `R$ ${val.toFixed(2)}` 
            },
            { 
              title: 'Ações', 
              key: 'actions', 
              render: (_, record) => (
                <Space size="middle">
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => handleEdit(record)}
                  >
                    Editar
                  </Button>
                  <Button 
                    type="primary" 
                    danger 
                    size="small"
                    onClick={() => handleDelete(record)}
                  >
                    Excluir
                  </Button>
                </Space>
              )
            },
          ]}
          dataSource={produtos}
        />
      </Card>

      <Modal
        title={editingProduto ? "Editar Produto" : "Novo Produto"}
        visible={modalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText={editingProduto ? "Salvar" : "Criar"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item 
            label="Nome" 
            name="nome" 
            rules={[{ required: true, message: 'Por favor, insira o nome do produto' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label="Preço" 
            name="preco" 
            rules={[{ required: true, message: 'Por favor, insira o preço' }]}
          >
            <Input type="number" step="0.01" prefix="R$" />
          </Form.Item>
          <Form.Item 
            label="Tipo" 
            name="tipo" 
            rules={[{ required: true, message: 'Por favor, selecione o tipo' }]}
          >
            <Select>
              <Option value="lanche">Lanche</Option>
              <Option value="bebida">Bebida</Option>
              <Option value="sobremesa">Sobremesa</Option>
              <Option value="porcao">Porção</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="Quantidade" 
            name="qtd" 
            rules={[{ required: true, message: 'Por favor, insira a quantidade' }]}
          >
            <Input type="number" min="0" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EstoquePage;