import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, List, message, Popconfirm, Typography, Row, Col, Divider, Empty, Tag, Input, Modal, Statistic, Tabs, InputNumber, Form, Select, Space } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, DollarCircleOutlined, CreditCardOutlined, QrcodeOutlined, UserOutlined } from '@ant-design/icons';
import { getMesas, adicionarProdutoNaMesa, fecharMesa, abrirMesaEspecifica, removerProdutoDaMesa, vincularClienteNaMesa, desvincularClienteDaMesa } from '../services/mesaService'; // Adicionar 'validarCupom'
import { fetchProdutos } from '../services/produtoService';
import { processarPagamento } from '../services/pagamentoService';
import { validarCupom } from '../services/cupomService';
import { fetchClientes } from '../services/clienteService';
import { SERVER_URL } from '../services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const MesaDetalhePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [mesa, setMesa] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vincularModalVisible, setVincularModalVisible] = useState(false);
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null); // Estado para controlar o carregamento por produto e evitar o erro de 2x
  const [searchTerm, setSearchTerm] = useState('');
  const [pagamentoModalVisible, setPagamentoModalVisible] = useState(false);
  const [valorPago, setValorPago] = useState(0);
  const [metodoPagamento, setMetodoPagamento] = useState('dinheiro');
  const [cupomCode, setCupomCode] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const [loadingCupom, setLoadingCupom] = useState(false);

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        setLoading(true); // Mantém o loading aqui
        // Carrega mesas, produtos e clientes em paralelo para otimizar
        const [todasAsMesas, produtosData, clientesData] = await Promise.all([
          getMesas(), 
          fetchProdutos(),
          fetchClientes()
        ]);
        
        const mesaEncontrada = todasAsMesas.find(m => m._id === id);
        
        if (mesaEncontrada && mesaEncontrada.status === 'fechada') {
          const mesaReaberta = await abrirMesaEspecifica(id);
          setMesa(mesaReaberta);
        } else {
          setMesa(mesaEncontrada);
        }
        setProdutos(produtosData);
        setClientes(clientesData);
      } catch (error) {
        message.error('Erro ao carregar dados iniciais.');
        navigate('/app/mesas');
      } finally {
        setLoading(false);
      }
    };

    carregarDadosIniciais();
  }, [id, navigate]); // Dependências estáveis, roda apenas uma vez

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const handleAdicionarProduto = async (produto) => {
    // Encontra a quantidade do produto que já está na mesa
    const quantidadeNaMesa = mesa.produtos
      .filter(item => item.produto == produto._id) // CORREÇÃO: Comparar diretamente os IDs
      .reduce((total, item) => total + item.quantidade, 0);

    if (quantidadeNaMesa >= produto.qtd) {
      message.warn('Não há mais estoque disponível para este produto.');
      return;
    }

    try {
      setAddingProductId(produto._id);

      // Apenas chama a API e atualiza o estado da mesa.
      // O backend já debita o estoque. O frontend recalculará o estoque disponível.
      const mesaAtualizada = await adicionarProdutoNaMesa(id, { produtoId: produto._id, quantidade: 1 });
      setMesa(mesaAtualizada);
      message.success(`'${produto.nome}' adicionado à mesa.`);
    } catch (error) {
      message.error('Erro ao adicionar produto.');
    } finally {
      setAddingProductId(null); // Reabilita o botão após a operação
    }
  };

  const handleRemoverProduto = async (produtoConsumidoId) => {
    // 1. Encontra o item a ser removido ANTES de qualquer chamada de API
    const itemRemovido = mesa.produtos.find(p => p._id === produtoConsumidoId);
    if (!itemRemovido) return; // Se não encontrar, não faz nada

    try {
      // Apenas chama a API e atualiza o estado da mesa.
      // O backend já devolve o estoque. O frontend recalculará o estoque disponível.
      const mesaAtualizada = await removerProdutoDaMesa(id, produtoConsumidoId);
      setMesa(mesaAtualizada);
      message.success('Item removido da comanda.');
    } catch (error) {
      message.error('Erro ao remover item.');
    }
  };

  const handleFecharMesa = async () => {
    const totalFinal = calcularTotalComDesconto(mesa.valorTotal, cupomAplicado);

    // ETAPA 1: Processar o pagamento
    try {
      await processarPagamento({
        valor: totalFinal,
        formaPagamento: metodoPagamento,
      });
      message.success({ content: 'Pagamento Aprovado!', key: 'pagamento', duration: 2 });
    } catch (error) {
      message.error({ content: error.response?.data?.mensagem || 'Falha no pagamento.', key: 'pagamento', duration: 3 });
      return; // Interrompe a função se o pagamento falhar
    }

    // ETAPA 2: Se o pagamento foi aprovado, fecha a mesa e registra a venda
    try {
      message.loading({ content: 'Registrando venda...', key: 'venda' });
      await fecharMesa(id, {
        formaPagamento: metodoPagamento, 
        totalComDesconto: totalFinal,
        cupomAplicado: cupomAplicado ? {
          codigo: cupomAplicado.codigo,
          valorDesconto: mesa.valorTotal - totalFinal
        } : null
      });
      message.success({ content: 'Mesa fechada e venda registrada!', key: 'venda', duration: 2 });
      setCupomCode('');
      setCupomAplicado(null);
      navigate('/app/mesas');
    } catch (error) {
      message.error(error.response?.data?.message || 'Erro ao fechar mesa.');
    }
  };

  const handleVincularCliente = async () => {
    try {
      const mesaAtualizada = await vincularClienteNaMesa(id, clienteSelecionadoId);
      setMesa(mesaAtualizada);
      message.success('Cliente vinculado com sucesso!');
      setVincularModalVisible(false);
      setClienteSelecionadoId(null);
    } catch (error) {
      message.error(error.response?.data?.message || 'Erro ao vincular cliente.');
    }
  };

  const handleDesvincularCliente = async () => {
    try {
      // 1. Chama a API para desvincular o cliente no backend
      await desvincularClienteDaMesa(id);
      
      // 2. Força a recarga dos dados da mesa do servidor para garantir consistência
      const todasAsMesas = await getMesas();
      const mesaAtualizadaDoServidor = todasAsMesas.find(m => m._id === id);
      setMesa(mesaAtualizadaDoServidor);
      message.success('Cliente desvinculado com sucesso!');
    } catch (error) {
      console.error('ERRO no frontend ao desvincular:', error.response?.data || error.message);
      message.error(error.response?.data?.message || 'Erro ao desvincular cliente.');
    }
  };

  const handleClienteIconClick = () => {
    if (mesa.cliente) {
      // Se já tem cliente, mostra opção para desvincular
      Modal.confirm({
        title: 'Desvincular Cliente?',
        content: `Deseja desvincular ${mesa.cliente.nome} desta mesa?`,
        okText: 'Sim, desvincular',
        cancelText: 'Cancelar',
        // CORREÇÃO: Envolve a chamada em uma função que retorna a promessa.
        // Isso garante que o modal espere a conclusão da operação async.
        onOk() {
          return handleDesvincularCliente();
        },
      });
    } else {
      // Se não tem, abre o modal para vincular
      setVincularModalVisible(true);
    }
  };

  // Filtra os produtos com base no termo de busca
  const produtosFiltrados = useMemo(() => {
    if (!searchTerm) return produtos;
    return produtos.filter(p => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [produtos, searchTerm]);

  const handleAplicarCupom = async () => {
    if (!cupomCode) return;
    setLoadingCupom(true);
    try {
      const cupomValido = await validarCupom(cupomCode);
      setCupomAplicado(cupomValido);
      message.success(`Cupom "${cupomValido.codigo}" aplicado com sucesso!`);
    } catch (error) {
      setCupomAplicado(null);
      message.error(error.response?.data?.message || 'Erro ao validar cupom.');
    } finally {
      setLoadingCupom(false);
    }
  };

  const calcularTotalComDesconto = (totalOriginal, cupom) => {
    if (!cupom) return totalOriginal;
    if (cupom.tipo === 'fixo') {
      return Math.max(0, totalOriginal - cupom.valor);
    }
    if (cupom.tipo === 'percentual') {
      const desconto = (totalOriginal * cupom.valor) / 100;
      return Math.max(0, totalOriginal - desconto);
    }
    return totalOriginal;
  };

  const removerCupom = () => {
    setCupomAplicado(null);
    setCupomCode('');
    message.info('Cupom removido.');
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spin size="large" /></div>;
  }

  if (!mesa) {
    return <Card><p>Mesa não encontrada.</p></Card>;
  }

  const totalComDesconto = calcularTotalComDesconto(mesa.valorTotal, cupomAplicado);

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
            renderItem={produto => {
              const quantidadeNaMesa = mesa.produtos
                .filter(item => item.produto == produto._id) // CORREÇÃO: Comparar diretamente os IDs
                .reduce((total, item) => total + item.quantidade, 0);
              const estoqueDisponivel = produto.qtd - quantidadeNaMesa;
              const esgotado = estoqueDisponivel <= 0; // Se o estoque disponível é zero ou menos
              const isAdding = addingProductId === produto._id; // Verifica se este produto está sendo adicionado

              return (
                <List.Item>
                <Card
                  hoverable
                  loading={isAdding} // Usa o loading nativo do Card, que mostra um skeleton
                  style={{ 
                    opacity: esgotado || isAdding ? 0.6 : 1, 
                    cursor: esgotado || isAdding ? 'not-allowed' : 'pointer',
                    pointerEvents: isAdding ? 'none' : 'auto' // Impede fisicamente qualquer clique durante a adição
                  }}
                  cover={!isAdding && <img 
                    alt={produto.nome} 
                    src={produto.imagemUrl ? `${SERVER_URL}${produto.imagemUrl}` : 'https://via.placeholder.com/150'} 
                    style={{ height: 140, objectFit: 'cover' }} 
                  />}
                  onClick={() => !esgotado && !isAdding && handleAdicionarProduto(produto)}
                  styles={{ body: { padding: isAdding ? 0 : '16px' } }} // CORREÇÃO: 'bodyStyle' depreciado
                >
                  <Card.Meta
                    title={produto.nome}
                    description={`R$ ${produto.preco.toFixed(2)}`}
                  />
                  <Tag color={estoqueDisponivel > 5 ? 'green' : estoqueDisponivel > 0 ? 'orange' : 'red'} style={{ marginTop: 8 }}>
                    {esgotado ? 'Esgotado' : `Disponível: ${estoqueDisponivel}`}
                  </Tag>
                </Card>
              </List.Item>
              );
            }}
          />
        </Card>
      </Col>

      {/* Coluna da Direita: Comanda da Mesa */}
      <Col xs={24} md={10}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              Mesa {mesa.numero} {mesa.cliente ? `- ${mesa.cliente.nome}` : ''}
            </Title>
            <Button icon={<UserOutlined />} onClick={handleClienteIconClick}>
              {mesa.cliente ? 'Desvincular' : 'Vincular Cliente'}
            </Button>
          </div>
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
                    title={item.nomeProduto} // Apenas o nome do produto
                    description={formatarMoeda(item.precoUnitario)} // Apenas o preço unitário
                  />
                  {/* O valor total já é calculado no final da lista */}
                </List.Item>
              )}
            />
          )}
          <Divider />
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 120px)' }}
                placeholder="Código do Cupom"
                value={cupomCode}
                onChange={(e) => setCupomCode(e.target.value.toUpperCase())}
                disabled={!!cupomAplicado}
              />
              <Button type="dashed" onClick={handleAplicarCupom} loading={loadingCupom} disabled={!!cupomAplicado}>
                Aplicar
              </Button>
            </Input.Group>
            {cupomAplicado && (
              <Tag closable color="success" onClose={removerCupom} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px' }}>
                <Text>Cupom <strong>{cupomAplicado.codigo}</strong> aplicado!</Text>
                <Text strong>- {formatarMoeda(mesa.valorTotal - totalComDesconto)}</Text>
              </Tag>
            )}
            <div style={{ textAlign: 'right' }}>
              {cupomAplicado && <Text delete>Total: {formatarMoeda(mesa.valorTotal)}</Text>}
              <Title level={3} style={{ margin: 0 }}>
                Total: {formatarMoeda(totalComDesconto)}
              </Title>
            </div>
          </Space>
          <Button 
            type="primary" 
            danger 
            block 
            size="large" 
            style={{ marginTop: 24 }}
            onClick={() => { setPagamentoModalVisible(true); setValorPago(totalComDesconto); }}
            disabled={mesa.produtos.length === 0}
          >
            Fechar Mesa e Pagar
          </Button>
        </Card>
      </Col>

      <Modal
        title="Vincular Cliente à Mesa"
        open={vincularModalVisible}
        onCancel={() => {
          setVincularModalVisible(false);
          setClienteSelecionadoId(null);
        }}
        footer={[
          <Button key="cancelar" onClick={() => setVincularModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="vincular" type="primary" onClick={handleVincularCliente} disabled={!clienteSelecionadoId}>
            Vincular Cliente
          </Button>,
        ]}
      >
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Pesquisar e selecionar cliente..."
          optionFilterProp="children"
          onChange={(value) => setClienteSelecionadoId(value)}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {clientes.map(cliente => (
            <Select.Option key={cliente._id} value={cliente._id}>{cliente.nome} - {cliente.cpf}</Select.Option>
          ))}
        </Select>
      </Modal>

      {mesa && (
        <Modal
          title={`Pagamento da Mesa ${mesa.numero}`}
          open={pagamentoModalVisible}
          onCancel={() => setPagamentoModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setPagamentoModalVisible(false)}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" onClick={handleFecharMesa}>
              Confirmar Pagamento
            </Button>,
          ]}
          width={600}
        >
          <Statistic 
            title="Valor Total da Mesa" 
            value={totalComDesconto} 
            precision={2} 
            prefix="R$ "
          />
          <Tabs defaultActiveKey="dinheiro" style={{ marginTop: 20 }} onChange={setMetodoPagamento}>
            <TabPane
              tab={<span><DollarCircleOutlined /> Dinheiro</span>}
              key="dinheiro"
            >
              <Form layout="vertical">
                <Form.Item label="Valor Pago">
                  <InputNumber
                    style={{ width: '100%' }}
                    prefix="R$ "
                    precision={2}
                    decimalSeparator=","
                    step="0.01"
                    onChange={setValorPago}
                  />
                </Form.Item>
                <Statistic 
                  title="Troco" 
                  value={Math.max(0, valorPago - totalComDesconto)} 
                  precision={2} 
                  prefix="R$ "
                  valueStyle={{ color: '#3f8600' }}
                />
              </Form>
            </TabPane>
            <TabPane tab={<span><CreditCardOutlined /> Cartão</span>} key="cartao">
              <Text>Aproxime ou insira o cartão na máquina.</Text><br/>
              <Text type="secondary">Simulação: O pagamento será aprovado automaticamente.</Text>
            </TabPane>
            <TabPane tab={<span><QrcodeOutlined /> PIX</span>} key="pix">
              <div style={{ textAlign: 'center' }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pix-copia-e-cola-simulado-para-mesa-${mesa.numero}`} alt="QR Code PIX" />
                <Text block copyable style={{ marginTop: 10 }}>{`pix-copia-e-cola-simulado-para-mesa-${mesa.numero}`}</Text>
                <Text type="secondary" block>Simulação: O pagamento será confirmado ao fechar a mesa.</Text>
              </div>
            </TabPane>
          </Tabs>
        </Modal>
      )}
    </Row>
  );
};

export default MesaDetalhePage;
