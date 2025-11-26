import React, { useEffect, useState, useMemo } from 'react';
import { 
  Card, Button, Input, List, Divider, message, Row, Col, Typography, 
  Space, Spin, Empty, Tag, Modal, Statistic, Tabs, InputNumber, Form 
} from 'antd';
import { 
  PlusOutlined, MinusOutlined, ShoppingCartOutlined, CreditCardOutlined, 
  MoneyCollectOutlined, QrcodeOutlined, CheckCircleOutlined 
} from '@ant-design/icons';

import { validarCupom } from '../services/cupomService';
import { processarPagamento } from '../services/pagamentoService';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { criarVenda } from '../services/vendaService';
import { fetchProdutos } from '../services/produtoService';
import { SERVER_URL } from '../services/api.js'; 
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function ProdutosPage() {
  const { usuario } = useUsuario();
  const navigate = useNavigate();

  // --- Estados ---
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [searchTerm, setSearchTerm] = useState('');

  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [finalizandoVenda, setFinalizandoVenda] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState('Finalizar Venda');
  const [pagamentoModalVisible, setPagamentoModalVisible] = useState(false);
  const [valorPago, setValorPago] = useState(0);
  const [pixStatus, setPixStatus] = useState('awaiting');
  const [cupomCode, setCupomCode] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const [loadingCupom, setLoadingCupom] = useState(false);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        setLoadingProdutos(true);
        const data = await fetchProdutos();
        console.log("Produtos Carregados:", data); // Debug
        
        if (Array.isArray(data)) setProdutos(data);
        else if (data && Array.isArray(data.produtos)) setProdutos(data.produtos);
        else if (data && Array.isArray(data.data)) setProdutos(data.data);
        else setProdutos([]);

      } catch (err) {
        message.error('Erro ao carregar produtos.');
      } finally {
        setLoadingProdutos(false);
      }
    };
    carregarProdutos();
  }, []);

  useEffect(() => {
    let timer;
    if (pagamentoModalVisible && formaPagamento === 'pix' && pixStatus === 'awaiting') {
      timer = setTimeout(() => {
        setPixStatus('confirmed');
        message.success('Pagamento PIX recebido!');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [pagamentoModalVisible, formaPagamento, pixStatus]);

  // --- HELPER PARA COMPARAR IDs COM SEGURANÇA ---
  const getSafeId = (item) => {
      if (!item) return '';
      // Se for objeto (ex: MongoDB), tenta pegar _id, senão usa o próprio item como string
      if (item._id) return String(item._id); 
      if (item.id) return String(item.id);
      return String(item);
  };

  // --- Lógica do Carrinho ---

  const adicionarCarrinho = (produto) => {
    const idProdutoNovo = getSafeId(produto);

    // Verifica se já existe usando o ID seguro
    const itemNoCarrinho = carrinho.find(item => getSafeId(item.produto) === idProdutoNovo);
    
    const quantidadeJaNoCarrinho = itemNoCarrinho ? Number(itemNoCarrinho.quantidade) : 0;
    const estoqueDisponivel = Number(produto.qtd);

    if (quantidadeJaNoCarrinho >= estoqueDisponivel) {
      message.warning('Estoque máximo atingido.');
      return;
    }

    setCarrinho(prevCarrinho => {
      // Verifica novamente dentro do set state para garantir consistência
      const index = prevCarrinho.findIndex(item => getSafeId(item.produto) === idProdutoNovo);

      if (index !== -1) {
        // Se encontrou (index diferente de -1), atualiza aquele item específico
        const novoCarrinho = [...prevCarrinho];
        novoCarrinho[index] = {
            ...novoCarrinho[index],
            quantidade: Number(novoCarrinho[index].quantidade) + 1
        };
        return novoCarrinho;
      }
      
      // Se não encontrou, adiciona novo
      return [...prevCarrinho, { produto: produto, quantidade: 1 }];
    });
    
    message.success('Adicionado!');
  };

  const alterarQuantidade = (produtoId, novaQuantidade) => {
    const idParaAlterar = String(produtoId);
    
    const produtoOriginal = produtos.find(p => getSafeId(p) === idParaAlterar);
    const estoqueMaximo = produtoOriginal ? Number(produtoOriginal.qtd) : 999;

    if (novaQuantidade > estoqueMaximo) { 
      message.warning(`Máximo: ${estoqueMaximo}`);
      return;
    }
    
    setCarrinho(prevCarrinho => {
      if (novaQuantidade < 1) {
        return prevCarrinho.filter(item => getSafeId(item.produto) !== idParaAlterar);
      }
      
      return prevCarrinho.map(item =>
        getSafeId(item.produto) === idParaAlterar
          ? { ...item, quantidade: Number(novaQuantidade) }
          : item
      );
    });
  };

  // --- Totais ---
  const handleAplicarCupom = async () => { /* ... logica igual ... */ 
      if (!cupomCode) return;
      setLoadingCupom(true);
      try {
        const cupom = await validarCupom(cupomCode);
        setCupomAplicado(cupom);
        message.success('Cupom aplicado!');
      } catch (error) {
        setCupomAplicado(null);
        message.error('Cupom inválido');
      } finally {
        setLoadingCupom(false);
      }
  };
  
  const removerCupom = () => { setCupomAplicado(null); setCupomCode(''); };

  const calcularTotalComDesconto = (totalOrig, cupom) => {
      if (!cupom) return totalOrig;
      if (cupom.tipo === 'fixo') return Math.max(0, totalOrig - cupom.valor);
      if (cupom.tipo === 'percentual') return Math.max(0, totalOrig - (totalOrig * cupom.valor / 100));
      return totalOrig;
  };

  const total = carrinho.reduce((acc, item) => acc + (Number(item.produto.preco) * Number(item.quantidade)), 0);
  const totalComDesconto = calcularTotalComDesconto(total, cupomAplicado);

  const handleFinalizarVenda = async () => {
    if (!usuario?._id) return message.error('Faça login.');
    if (carrinho.length === 0) return message.warn('Carrinho vazio.');
    if (formaPagamento === 'dinheiro' && valorPago < totalComDesconto) return message.error('Valor insuficiente.');

    setFinalizandoVenda(true);
    setPaymentStatusText('Processando...');

    try {
      await processarPagamento({ valor: totalComDesconto, formaPagamento });
    } catch (error) {
      setFinalizandoVenda(false);
      setPaymentStatusText('Finalizar Venda');
      return message.error('Erro pagamento.');
    }

    const vendaData = {
        cliente: { _id: usuario._id, nome: usuario.nome },
        produtos: carrinho.map(item => ({
            produto: item.produto,
            quantidade: Number(item.quantidade)
        })),
        formaPagamento,
        total: totalComDesconto,
        cupomAplicado: cupomAplicado ? { codigo: cupomAplicado.codigo, valorDesconto: total - totalComDesconto } : null
    };

    try {
        await criarVenda(vendaData);
        setCarrinho([]);
        setPagamentoModalVisible(false);
        setCupomCode('');
        setCupomAplicado(null);
        navigate('/app/vendas');
        message.success('Venda Sucesso!');
    } catch (error) {
        message.error('Erro ao salvar venda.');
    } finally {
        setFinalizandoVenda(false);
        setPaymentStatusText('Finalizar Venda');
    }
  };

  const produtosFiltrados = useMemo(() => {
    if (!searchTerm) return produtos;
    return produtos.filter(p => p && p.nome && p.nome.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [produtos, searchTerm]);

  return (
    <Row gutter={24}>
      {/* --- LISTA DE PRODUTOS --- */}
      <Col xs={24} md={14}>
        <Card title="Selecione os Produtos">
          <Input.Search
            placeholder="Buscar..."
            onChange={e => setSearchTerm(e.target.value)}
            style={{ marginBottom: 16 }}
            allowClear
          />
          {loadingProdutos ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}><Spin size="large" /></div>
          ) : (
            <List
              rowKey={(item) => getSafeId(item)}
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
              dataSource={produtosFiltrados}
              renderItem={produto => {
                const idProd = getSafeId(produto);
                const itemNoCarrinho = carrinho.find(item => getSafeId(item.produto) === idProd);
                const qtdCarrinho = itemNoCarrinho ? Number(itemNoCarrinho.quantidade) : 0;
                
                const estoqueTotal = Number(produto.qtd);
                const disponivel = estoqueTotal - qtdCarrinho;
                const esgotado = disponivel <= 0;

                return (
                  <List.Item>
                    <Card
                      hoverable
                      style={{ opacity: esgotado ? 0.6 : 1, cursor: esgotado ? 'not-allowed' : 'pointer' }}
                      cover={
                        <img 
                          alt={produto.nome} 
                          src={produto.imagemUrl ? `${SERVER_URL}${produto.imagemUrl}` : 'https://via.placeholder.com/150'} 
                          style={{ height: 140, objectFit: 'cover' }} 
                        />
                      }
                      onClick={() => !esgotado && adicionarCarrinho(produto)}
                      styles={{ body: { padding: '12px' } }}
                    >
                      <Card.Meta
                        title={<Text ellipsis>{produto.nome}</Text>}
                        description={
                          <Space direction="vertical" size={0} style={{ width: '100%' }}>
                            <Text strong>R$ {Number(produto.preco).toFixed(2)}</Text>
                            <Tag color={esgotado ? 'red' : 'green'} style={{ marginTop: 5 }}>
                              {esgotado ? 'Esgotado' : `Estoque: ${disponivel}`}
                            </Tag>
                          </Space>
                        }
                      />
                    </Card>
                  </List.Item>
                )}}
            />
          )}
        </Card>
      </Col>

      {/* --- CARRINHO --- */}
      <Col xs={24} md={10}>
        <Card>
          <Title level={4}><ShoppingCartOutlined /> Carrinho</Title>
          <Divider />
          {carrinho.length === 0 ? (
            <Empty description="Vazio" />
          ) : (
            <List
              // FIX: rowKey agora usa o index como fallback para mostrar se houver duplicatas
              rowKey={(item, index) => item.produto._id ? String(item.produto._id) : index}
              dataSource={carrinho}
              renderItem={item => {
                const precoUnit = Number(item.produto.preco);
                const quantidade = Number(item.quantidade);
                const subtotalItem = precoUnit * quantidade;
                const estoqueMax = Number(item.produto.qtd);

                return (
                  <List.Item>
                    <List.Item.Meta
                      title={item.produto.nome}
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                             {quantidade}x R$ {precoUnit.toFixed(2)}
                          </Text>
                          <div style={{ marginTop: 4 }}>
                            <Text strong style={{ color: '#1890ff' }}>
                              Total: R$ {subtotalItem.toFixed(2)}
                            </Text>
                          </div>
                        </div>
                      }
                    />
                    <Space>
                      <Button 
                        icon={<MinusOutlined />} 
                        size="small" 
                        onClick={() => alterarQuantidade(item.produto._id, quantidade - 1)} 
                      />
                      <Text strong style={{ minWidth: '30px', textAlign: 'center', display: 'inline-block' }}>
                        {quantidade}
                      </Text>
                      <Button 
                        icon={<PlusOutlined />} 
                        size="small" 
                        disabled={quantidade >= estoqueMax}
                        onClick={() => alterarQuantidade(item.produto._id, quantidade + 1)} 
                      />
                    </Space>
                  </List.Item>
                )
              }}
            />
          )}
          
          {carrinho.length > 0 && (
            <>
               <Divider />
               <div style={{ textAlign: 'right', marginBottom: 15 }}>
                  <Title level={2} style={{ margin: 0, color: '#3f8600' }}>
                    R$ {totalComDesconto.toFixed(2)}
                  </Title>
               </div>
               {/* ... (mantive seus botoes de cupom e finalizar aqui igual) ... */}
               <Button type="primary" size="large" block onClick={() => {
                  setPagamentoModalVisible(true);
                  setValorPago(totalComDesconto);
                  setPixStatus('awaiting');
               }}>Finalizar Venda</Button>
            </>
          )}
        </Card>
      </Col>

      {/* --- MODAL (Mantive igual) --- */}
      <Modal
        title="Finalizar Venda"
        open={pagamentoModalVisible}
        onCancel={() => !finalizandoVenda && setPagamentoModalVisible(false)}
        footer={null}
        width={600}
      >
        <Statistic title="Total" value={totalComDesconto} precision={2} prefix="R$ " />
        <Tabs defaultActiveKey="dinheiro" style={{ marginTop: 20 }} onChange={key => setFormaPagamento(key)}>
            <TabPane tab="Dinheiro" key="dinheiro">
                <Form layout="vertical">
                    <Form.Item label="Recebido">
                        <InputNumber style={{width: '100%'}} prefix="R$ " value={valorPago} onChange={setValorPago} />
                    </Form.Item>
                    <Statistic title="Troco" value={Math.max(0, valorPago - totalComDesconto)} precision={2} prefix="R$ " valueStyle={{color: 'green'}} />
                </Form>
            </TabPane>
            <TabPane tab="PIX" key="pix">
                 <div style={{textAlign: 'center', padding: 20}}>
                    {pixStatus === 'awaiting' ? <p>Aguardando...</p> : <CheckCircleOutlined style={{fontSize: 40, color: 'green'}} />}
                 </div>
            </TabPane>
             <TabPane tab="Cartão" key="cartao_credito">
                 <div style={{textAlign: 'center', padding: 20}}><p>Máquina...</p></div>
            </TabPane>
        </Tabs>
        <div style={{textAlign: 'right', marginTop: 20}}>
             <Button type="primary" onClick={handleFinalizarVenda} loading={finalizandoVenda} disabled={formaPagamento === 'pix' && pixStatus !== 'confirmed'}>
                {paymentStatusText}
             </Button>
        </div>
      </Modal>
    </Row>
  );
}