import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, message, Upload, Avatar, InputNumber } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { fetchProdutos, createProduto, updateProduto, deleteProduto } from '../services/produtoService';
import { useUsuario } from '../context/UsuarioContext'; // Importa o contexto do usuário
import { SERVER_URL } from '../services/api'; // Importa a URL base do servidor

const { Option } = Select;

const EstoquePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [editingProduto, setEditingProduto] = useState(null);
  const [fileList, setFileList] = useState([]);
  const { usuario } = useUsuario(); // Pega o usuário logado do contexto

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
    form.setFieldsValue(record);

    // Se o produto tiver uma imagem, prepara o fileList para exibi-la
    if (record.imagemUrl) {
      setFileList([
        {
          uid: '-1',
          name: 'imagem_atual.png',
          status: 'done',
          url: `http://localhost:3000${record.imagemUrl}`,
          thumbUrl: `http://localhost:3000${record.imagemUrl}`,
        },
      ]);
    } else {
      setFileList([]);
    }

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
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        // CORREÇÃO: Ignora o campo 'imagem' ao percorrer os valores do formulário.
        const value = values[key];
        if (key !== 'imagem' && value !== undefined && value !== null) {
          // Garante que os valores numéricos sejam convertidos para string antes de enviar
          if (typeof value === 'number') {
            formData.append(key, String(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      // CORREÇÃO: Pega o arquivo diretamente dos 'values' do formulário.
      // O 'values.imagem' conterá o array de arquivos graças ao 'getValueFromEvent' no Form.Item.
      const file = values.imagem && values.imagem[0];

      if (file && file.originFileObj) {
        // A chave DEVE ser 'imagem', que é o que o multer espera no backend.
        // O valor DEVE ser o arquivo bruto.
        console.log('Anexando arquivo ao FormData:', file.originFileObj);
        formData.append('imagem', file.originFileObj, file.name);
      }

      if (editingProduto) {
        console.log('Atualizando produto:', editingProduto._id);
        const updatedProduct = await updateProduto(editingProduto._id, formData);
        console.log('Resposta da atualização:', updatedProduct);
        message.success('Produto atualizado com sucesso!');
      } else {
        console.log('Criando novo produto');
        const newProduct = await createProduto(formData);
        console.log('Resposta da criação:', newProduct);
        message.success('Produto criado com sucesso!');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingProduto(null);
      setFileList([]);
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
    setFileList([]);
  };

  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: file => { setFileList([file]); return false; },
    fileList,
    maxCount: 1,
  };

  // Define se o usuário tem permissão para gerenciar o estoque
  const podeGerenciarEstoque = usuario?.cargo === 'gerente';

  return (
    <div>
      <Card 
        title="Controle de Estoque" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => { setEditingProduto(null); setModalVisible(true); }}
            // Esconde o botão se não tiver permissão
            style={{ display: podeGerenciarEstoque ? 'inline-block' : 'none' }}
          >
            Novo Produto
          </Button>
        }
      >
        <Table 
          loading={loading}
          columns={[
            { title: 'Código', dataIndex: 'cod', key: 'cod' },
            {
              title: 'Imagem',
              dataIndex: 'imagemUrl',
              key: 'imagem',
              render: (imagemUrl) => (
                <Avatar 
                  shape="square" 
                  size={48}
                  src={imagemUrl ? `${SERVER_URL}${imagemUrl}` : undefined} />
              ),
            },
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
              title: 'Custo', 
              dataIndex: 'custo', 
              key: 'custo', 
              render: val => `R$ ${val ? val.toFixed(2) : '0.00'}` 
            },
            { 
              title: 'Ações', 
              key: 'actions', 
              render: (_, record) => (
                <Space size="middle">
                  {podeGerenciarEstoque && (
                    <>
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
                    </>
                  )}
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
            label="Custo" 
            name="custo" 
            rules={[{ required: true, message: 'Por favor, insira o custo do produto' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              prefix="R$" step="0.01" precision={2} />
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
            label="Imagem do Produto" 
            name="imagem"
            // Extrai a lista de arquivos do evento de upload
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>
                {fileList.length > 0 ? 'Trocar Imagem' : 'Selecionar Imagem'}
              </Button>
            </Upload>
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