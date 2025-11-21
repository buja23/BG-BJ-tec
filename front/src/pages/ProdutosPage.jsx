import React, { useEffect, useState } from 'react';
import { Card, Button, Input, List, Divider, message, Row, Col, Typography, Select, Space, Spin, Empty, Tag } from 'antd';
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined, CreditCardOutlined, MoneyCollectOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { limparCarrinho } from '../services/carrinhoService';
import { criarVenda } from '../services/vendaService';
import { fetchProdutos } from '../services/produtoService';
import { SERVER_URL } from '../services/api.js'; // 1. Importar a URL do servidor
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

export default function ProdutosPage() {
  const { usuario } = useUsuario();
  const navigate = useNavigate();

  // Estados de dados
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');

  // Estados de UI/Processamento
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [finalizandoVenda, setFinalizandoVenda] = useState(false);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setLoadingProdutos(true);
        const data = await fetchProdutos();
        setProdutos(data);
      } catch (err) {
        message.error('Falha ao carregar produtos.');
        console.error(err);
      } finally {
        setLoadingProdutos(false);
      }
    };
    carregarProdutos();
  }, []);

  const adicionarCarrinho = (produto) => {
    setCarrinho(prevCarrinho => {
      const itemExistente = prevCarrinho.find(item => item.produto._id === produto._id);
      if (itemExistente) {
        // Se o item já existe, apenas incrementa a quantidade
        return prevCarrinho.map(item =>
          item.produto._id === produto._id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      // Se não existe, adiciona o novo produto ao carrinho
      return [...prevCarrinho, { produto: produto, quantidade: 1 }];
    });
  };

  const alterarQuantidade = (produtoId, novaQuantidade) => {
    setCarrinho(prevCarrinho => {
      if (novaQuantidade < 1) {
        // Remove o item se a quantidade for menor que 1
        return prevCarrinho.filter(item => item.produto._id !== produtoId);
      }
      return prevCarrinho.map(item =>
        item.produto._id === produtoId
          ? { ...item, quantidade: novaQuantidade }
          : item
      );
    });
  };

  const handleFinalizarVenda = async () => {
    if (!usuario?._id) {
      return message.error('Usuário não identificado. Faça login para continuar.');
    }
    if (carrinho.length === 0) {
      return message.warn('O carrinho está vazio.');
    }

    setFinalizandoVenda(true);

    const vendaData = {
      cliente: {
        _id: usuario._id,
        nome: usuario.nome
      },
      produtos: carrinho.map(item => ({
        produto: item.produto, // Passa o objeto de produto inteiro
        quantidade: item.quantidade
      })),
      formaPagamento: formaPagamento,
      total: total
    };

    try {
      await criarVenda(vendaData);
      // A limpeza do carrinho no backend não é mais necessária se o carrinho for apenas local
      setCarrinho([]);
      message.success('Venda finalizada com sucesso!');
      navigate('/app/vendas');
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao finalizar venda. Verifique o estoque e tente novamente.';
      message.error(errorMessage);
    } finally {
      setFinalizandoVenda(false);
    }
  };

  const total = carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);

  const paymentMethods = [
    { key: 'dinheiro', label: 'Dinheiro', icon: <MoneyCollectOutlined /> },
    { key: 'cartao_credito', label: 'Crédito', icon: <CreditCardOutlined /> },
    { key: 'cartao_debito', label: 'Débito', icon: <CreditCardOutlined /> },
    { key: 'pix', label: 'PIX', icon: <QrcodeOutlined /> },
  ];

  return (
    <Row gutter={24}>
      {/* Coluna da Esquerda: Produtos */}
      <Col xs={24} md={14}>
        <Card title="Selecione os Produtos">
          {loadingProdutos ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
              dataSource={produtos}
              renderItem={produto => (
                <List.Item>
                  <Card
                    hoverable
                    cover={<img 
                      alt={produto.nome} 
                      src={produto.imagemUrl ? `${SERVER_URL}${produto.imagemUrl}` : 'https://via.placeholder.com/150'} 
                      style={{ height: 140, objectFit: 'cover' }} 
                    />}
                    onClick={() => adicionarCarrinho(produto)}
                    styles={{ body: { padding: '16px' } }} // 2. Correção da prop depreciada
                  >
                    <Card.Meta
                      title={produto.nome}
                      description={`R$ ${produto.preco.toFixed(2)}`}
                    />
                    <Tag color={produto.qtd > 10 ? 'green' : 'orange'} style={{ marginTop: 8 }}>
                      Estoque: {produto.qtd}
                    </Tag>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Card>
      </Col>

      {/* Coluna da Direita: Carrinho e Finalização */}
      <Col xs={24} md={10}>
        <Card>
          <Title level={4}><ShoppingCartOutlined /> Carrinho</Title>
          <Divider />
          {carrinho.length === 0 ? (
            <Empty description="Seu carrinho está vazio" />
          ) : (
            <List
              dataSource={carrinho}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.produto.nome}
                    description={`R$ ${item.produto.preco.toFixed(2)}`}
                  />
                  <Space>
                    <Button icon={<MinusOutlined />} size="small" onClick={() => alterarQuantidade(item.produto._id, item.quantidade - 1)} />
                    <Text>{item.quantidade}</Text>
                    <Button icon={<PlusOutlined />} size="small" onClick={() => alterarQuantidade(item.produto._id, item.quantidade + 1)} />
                  </Space>
                </List.Item>
              )}
            />
          )}

          {carrinho.length > 0 && (
            <>
              <Divider />
              <Title level={3} style={{ textAlign: 'right' }}>
                Total: R$ {total.toFixed(2)}
              </Title>
              <Divider>Forma de Pagamento</Divider>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Space wrap>
                  {paymentMethods.map(method => (
                    <Button
                      key={method.key}
                      type={formaPagamento === method.key ? 'primary' : 'default'}
                      icon={method.icon}
                      size="large"
                      onClick={() => setFormaPagamento(method.key)}
                    >
                      {method.label}
                    </Button>
                  ))}
                </Space>
              </div>
              <Button
                type="primary"
                size="large"
                block
                loading={finalizandoVenda}
                onClick={handleFinalizarVenda}
              >
                {finalizandoVenda ? 'Processando...' : 'Finalizar Venda'}
              </Button>
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
}
