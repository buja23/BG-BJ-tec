import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, List, message, Popconfirm, Typography, Row, Col, Divider, Empty, Tag, Input } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { getMesas, adicionarProdutoNaMesa, fecharMesa, abrirMesaEspecifica, removerProdutoDaMesa } from '../services/mesaService';
import { fetchProdutos } from '../services/produtoService';
import { SERVER_URL } from '../services/api';

const { Title, Text } = Typography;

const MesaDetalhePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [mesa, setMesa] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const carregarDadosMesa = async () => {
    try {
      setLoading(true);
      // A rota getMesas retorna um array, precisamos encontrar a mesa certa
      const todasAsMesas = await getMesas();
      let mesaAtual = todasAsMesas.find(m => m._id === id);

      if (mesaAtual && mesaAtual.status === 'fechada') {
        // Se a mesa estiver fechada, abre ela
        mesaAtual = await abrirMesaEspecifica(id);
        message.success(`Mesa ${mesaAtual.numero} reaberta!`);
      }
      
      setMesa(mesaAtual);
    } catch (error) {
      message.error('Erro ao carregar dados da mesa.');
      navigate('/app/mesas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosMesa();
    fetchProdutos().then(setProdutos);
  }, [id]);

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const handleAdicionarProduto = async (produto) => {
    try {
      const mesaAtualizada = await adicionarProdutoNaMesa(id, { produtoId: produto._id, quantidade: 1 });
      setMesa(mesaAtualizada);
      message.success(`'${produto.nome}' adicionado à mesa.`);
    } catch (error) {
      message.error('Erro ao adicionar produto.');
    }
  };

  const handleRemoverProduto = async (produtoConsumidoId) => {
    try {
      const mesaAtualizada = await removerProdutoDaMesa(id, produtoConsumidoId);
      setMesa(mesaAtualizada);
      message.success('Item removido da comanda.');
    } catch (error) {
      message.error('Erro ao remover item.');
    }
  };

  const handleFecharMesa = async () => {
    try {
      await fecharMesa(id, { formaPagamento: 'dinheiro' });
      message.success('Mesa fechada e venda registrada!');
      navigate('/app/mesas');
    } catch (error) {
      message.error(error.response?.data?.message || 'Erro ao fechar mesa.');
    }
  };

  // Filtra os produtos com base no termo de busca
  const produtosFiltrados = useMemo(() => {
    if (!searchTerm) return produtos;
    return produtos.filter(p => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [produtos, searchTerm]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spin size="large" /></div>;
  }

  if (!mesa) {
    return <Card><p>Mesa não encontrada.</p></Card>;
  }

  return (
    <Row gutter={24}>
      {/* Coluna da Esquerda: Catálogo de Produtos */}
      <Col xs={24} md={14}>
        <Card title="Adicionar Produtos" extra={<Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/app/mesas')}>Voltar</Button>}>
          <Input.Search
            placeholder="Buscar produto..."
            onChange={e => setSearchTerm(e.target.value)}
            style={{ marginBottom: 16 }}
            allowClear
          />
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
            dataSource={produtosFiltrados}
            renderItem={produto => (
              <List.Item>
                <Card
                  hoverable
                  cover={<img alt={produto.nome} src={produto.imagemUrl ? `${SERVER_URL}${produto.imagemUrl}` : 'https://via.placeholder.com/150'} style={{ height: 140, objectFit: 'cover' }} />}
                  onClick={() => handleAdicionarProduto(produto)}
                  styles={{ body: { padding: '16px' } }}
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
        </Card>
      </Col>

      {/* Coluna da Direita: Comanda da Mesa */}
      <Col xs={24} md={10}>
        <Card>
          <Title level={4}>Comanda da Mesa {mesa.numero}</Title>
          <Divider />
          {mesa.produtos.length === 0 ? (
            <Empty description="Nenhum produto na mesa." />
          ) : (
            <List
              dataSource={mesa.produtos}
              rowKey="_id"
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title="Remover este item?"
                      onConfirm={() => handleRemoverProduto(item._id)}
                      okText="Sim"
                      cancelText="Não"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    title={item.nomeProduto}
                    description={`${item.quantidade}x ${formatarMoeda(item.precoUnitario)}`}
                  />
                  <Text strong>{formatarMoeda(item.quantidade * item.precoUnitario)}</Text>
                </List.Item>
              )}
            />
          )}
          <Divider />
          <Title level={3} style={{ textAlign: 'right' }}>
            Total: {formatarMoeda(mesa.valorTotal)}
          </Title>
          <Popconfirm
            title="Fechar mesa e registrar a venda?"
            onConfirm={handleFecharMesa}
            okText="Sim, fechar"
            cancelText="Não"
          >
            <Button type="primary" danger block size="large" style={{ marginTop: 24 }}>
              Fechar Mesa e Registrar Venda
            </Button>
          </Popconfirm>
        </Card>
      </Col>
    </Row>
  );
};

export default MesaDetalhePage;
