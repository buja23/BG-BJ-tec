import React, { useEffect, useState, useMemo } from 'react';
import { Card, Button, Input, List, Divider, message, Row, Col, Typography, Select, Space, Spin, Empty, Tag, Modal, Statistic, Tabs, InputNumber, Form } from 'antd';
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined, CreditCardOutlined, MoneyCollectOutlined, QrcodeOutlined, TagOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { validarCupom } from '../services/cupomService';
import { processarPagamento } from '../services/pagamentoService';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { limparCarrinho } from '../services/carrinhoService';
import { criarVenda } from '../services/vendaService';
import { fetchProdutos } from '../services/produtoService';
import { SERVER_URL } from '../services/api.js'; // 1. Importar a URL do servidor
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function ProdutosPage() {
  const { usuario } = useUsuario();
  const navigate = useNavigate();

  // Estados de dados
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de UI/Processamento
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [finalizandoVenda, setFinalizandoVenda] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState('Finalizar Venda');
  const [pagamentoModalVisible, setPagamentoModalVisible] = useState(false);
  const [valorPago, setValorPago] = useState(0);
  const [pixStatus, setPixStatus] = useState('awaiting'); // 'awaiting', 'confirmed'
  const [cupomCode, setCupomCode] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const [loadingCupom, setLoadingCupom] = useState(false);

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
    const itemNoCarrinho = carrinho.find(item => item.produto._id === produto._id);
    const quantidadeJaNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
    const estoqueDisponivel = produto.qtd - quantidadeJaNoCarrinho;

    if (estoqueDisponivel <= 0) {
      message.warn('Não há mais estoque disponível para este produto.');
      return;
    }

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
    const produto = produtos.find(p => p._id === produtoId);
    if (!produto) return;

    const itemNoCarrinho = carrinho.find(item => item.produto._id === produtoId);
    const quantidadeJaNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;

    if (novaQuantidade > produto.qtd) { // A nova quantidade total não pode exceder o estoque físico
      message.warn(`A quantidade máxima em estoque é ${produto.qtd}.`);
      return;
    }
    
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

    if (formaPagamento === 'dinheiro' && valorPago < total) {
      message.error('O valor pago não pode ser menor que o total da venda.');
      return;
    }

    // Calcula o total com desconto
    const totalFinal = cupomAplicado 
      ? calcularTotalComDesconto(total, cupomAplicado) 
      : total;


    setFinalizandoVenda(true);

    // ETAPA 1: Processar o pagamento
    try {
      setPaymentStatusText('Processando Pagamento...');
      await processarPagamento({
        valor: totalFinal,
        formaPagamento: formaPagamento,
      });
      message.success('Pagamento Aprovado!');
    } catch (error) {
      message.error(error.response?.data?.mensagem || 'Falha no pagamento.');
      setFinalizandoVenda(false);
      setPaymentStatusText('Finalizar Venda');
      return; // Interrompe a função se o pagamento falhar
    }

    const performSale = async () => {
        const vendaData = {
            cliente: { _id: usuario._id, nome: usuario.nome },
            produtos: carrinho.map(item => ({
                produto: item.produto,
                quantidade: item.quantidade
            })),
            formaPagamento: formaPagamento,
            total: totalFinal, // Envia o total com desconto
            cupomAplicado: cupomAplicado ? {
              codigo: cupomAplicado.codigo,
              valorDesconto: total - totalFinal
            } : null
        };

        try {
            await criarVenda(vendaData);
            setCarrinho([]);
            message.success('Venda finalizada com sucesso!');
            setPagamentoModalVisible(false);
            setCupomCode('');
            setCupomAplicado(null);
            navigate('/app/vendas');
        } catch (error) {
            console.error('Erro ao finalizar venda:', error);
            const errorMessage = error.response?.data?.message || 'Erro ao finalizar venda. Verifique o estoque e tente novamente.';
            message.error(errorMessage);
        } finally {
            setFinalizandoVenda(false);
            setPaymentStatusText('Finalizar Venda');
        }
    };

    // ETAPA 2: Se o pagamento foi aprovado, registra a venda
    setPaymentStatusText('Registrando Venda...');
    await performSale();
  };

  // Simula a confirmação de pagamento PIX
  useEffect(() => {
    let timer;
    if (pagamentoModalVisible && formaPagamento === 'pix' && pixStatus === 'awaiting') {
      timer = setTimeout(() => {
        setPixStatus('confirmed');
        message.success('Pagamento PIX recebido!');
      }, 5000); // Simula recebimento após 5 segundos
    }
    return () => clearTimeout(timer); // Limpa o timer se o modal for fechado
  }, [pagamentoModalVisible, formaPagamento, pixStatus]);

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

  // Filtra os produtos com base no termo de busca
  const produtosFiltrados = useMemo(() => {
    if (!searchTerm) return produtos;
    return produtos.filter(p => 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [produtos, searchTerm]);

  const total = carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);
  const totalComDesconto = calcularTotalComDesconto(total, cupomAplicado);

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
          <Input.Search
            placeholder="Buscar produto pelo nome..."
            onChange={e => setSearchTerm(e.target.value)}
            style={{ marginBottom: 16 }}
            allowClear
          />
          {loadingProdutos ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
              dataSource={produtosFiltrados}
              renderItem={produto => {
                const itemNoCarrinho = carrinho.find(item => item.produto._id === produto._id);
                const quantidadeNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
                const estoqueDisponivel = produto.qtd - quantidadeNoCarrinho;
                const esgotado = estoqueDisponivel <= 0;

                return (
                  <List.Item>
                  <Card
                    hoverable
                    style={{ opacity: esgotado ? 0.6 : 1, cursor: esgotado ? 'not-allowed' : 'pointer' }}
                    cover={<img 
                      alt={produto.nome} 
                      src={produto.imagemUrl ? `${SERVER_URL}${produto.imagemUrl}` : 'https://via.placeholder.com/150'} 
                      style={{ height: 140, objectFit: 'cover' }} 
                    />}
                    onClick={() => !esgotado && adicionarCarrinho(produto)}
                    styles={{ body: { padding: '16px' } }} // 2. Correção da prop depreciada
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
              )}}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Space>
                      <Button icon={<MinusOutlined />} size="small" onClick={() => alterarQuantidade(item.produto._id, item.quantidade - 1)} />
                      <Text>{item.quantidade}</Text>
                      <Button icon={<PlusOutlined />} size="small" onClick={() => alterarQuantidade(item.produto._id, item.quantidade + 1)} />
                    </Space>
                    <Text strong>
                      {`R$ ${(item.produto.preco * item.quantidade).toFixed(2)}`}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          )}

          {carrinho.length > 0 && (
            <>
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
                    <Text strong>- R$ {(total - totalComDesconto).toFixed(2)}</Text>
                  </Tag>
                )}
                <div style={{ textAlign: 'right' }}>
                  {cupomAplicado && <Text delete>Total: R$ {total.toFixed(2)}</Text>}
                  <Title level={3} style={{ margin: 0 }}>
                    Total: R$ {totalComDesconto.toFixed(2)}
                  </Title>
                </div>
              </Space>


              <Button
                type="primary"
                size="large"
                block
                onClick={() => {
                  setPagamentoModalVisible(true);
                  setValorPago(totalComDesconto); // Preenche o valor pago com o total com desconto
                  setPixStatus('awaiting'); // Reseta o status do PIX
                }}
              >
                Finalizar Venda
              </Button>
            </>
          )}
        </Card>
      </Col>

      <Modal
        title="Finalizar Venda"
        open={pagamentoModalVisible}
        onCancel={() => setPagamentoModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPagamentoModalVisible(false)} disabled={finalizandoVenda}>
            Cancelar
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleFinalizarVenda} 
            loading={finalizandoVenda}
            disabled={(formaPagamento === 'pix' && pixStatus !== 'confirmed') || finalizandoVenda}
          >
            {paymentStatusText}
          </Button>,
        ]}
        width={600}
      >
        <Statistic 
          title="Valor Total da Venda" 
          value={totalComDesconto} 
          precision={2} 
          prefix="R$ "
        />
        <Tabs defaultActiveKey="dinheiro" style={{ marginTop: 20 }} onChange={(key) => {
          setFormaPagamento(key);
          setPixStatus('awaiting'); // Reseta o status do PIX ao trocar de aba
        }}>
          <TabPane
            tab={<span><MoneyCollectOutlined /> Dinheiro</span>}
            key="dinheiro"
          >
            <Form layout="vertical">
              <Form.Item label="Valor Recebido">
                <InputNumber
                  style={{ width: '100%' }}
                  prefix="R$ "
                  precision={2}
                  decimalSeparator=","
                  step="0.01"
                  value={valorPago}
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
          <TabPane tab={<span><CreditCardOutlined /> Cartão</span>} key="cartao_credito">
            <Text>Aproxime ou insira o cartão na máquina.</Text><br/>
            <Text type="secondary">Simulação: O pagamento será aprovado em 3 segundos.</Text>
          </TabPane>
          <TabPane tab={<span><QrcodeOutlined /> PIX</span>} key="pix">
            <div style={{ textAlign: 'center' }}>
              {pixStatus === 'awaiting' ? (
                <>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pix-copia-e-cola-simulado-venda-direta`} alt="QR Code PIX" />
                  <Text block copyable style={{ marginTop: 10 }}>{`pix-copia-e-cola-simulado-venda-direta`}</Text>
                  <Text type="secondary" block>Aguardando confirmação do pagamento...</Text>
                </>
              ) : (
                <div style={{ padding: '40px 0' }}>
                  <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                  <Title level={4}>Pagamento Confirmado!</Title>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    </Row>
  );
}
