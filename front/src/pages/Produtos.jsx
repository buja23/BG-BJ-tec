import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Button, 
  Upload, 
  message,
  Row,
  Col
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const CadastroProduto = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Você só pode enviar arquivos JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('A imagem deve ser menor que 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Aqui você faria a chamada para sua API
      console.log('Dados do produto:', {
        ...values,
        imagem: fileList[0]?.originFileObj
      });
      
      message.success('Produto cadastrado com sucesso!');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Erro ao cadastrar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="Cadastro de Novo Produto" 
        bordered={false}
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nome"
                label="Nome do Produto"
                rules={[{ required: true, message: 'Por favor, insira o nome do produto' }]}
              >
                <Input placeholder="Ex: Cerveja Artesanal" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoria"
                label="Categoria"
                rules={[{ required: true, message: 'Por favor, selecione a categoria' }]}
              >
                <Input placeholder="Ex: Bebidas, Alimentos" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="quantidade"
                label="Quantidade em Estoque"
                rules={[{ required: true, message: 'Por favor, insira a quantidade' }]}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }} 
                  placeholder="Ex: 50" 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="valorUnitario"
                label="Valor Unitário (R$)"
                rules={[{ required: true, message: 'Por favor, insira o valor' }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/R\$\s?|(,*)/g, '')}
                  placeholder="Ex: 12.00"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="descricao"
            label="Descrição do Produto"
          >
            <TextArea rows={4} placeholder="Insira detalhes sobre o produto" />
          </Form.Item>

          <Form.Item
            label="Imagem do Produto"
            extra="Envie uma imagem representativa do produto"
          >
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Selecionar Imagem</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ marginRight: 8 }}
            >
              Cadastrar Produto
            </Button>
            <Button onClick={() => form.resetFields()}>
              Limpar Formulário
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CadastroProduto;