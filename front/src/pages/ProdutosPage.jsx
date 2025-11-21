import React, { useEffect, useState } from 'react';
import { Card, Button, Input, List, Divider, message } from 'antd';
import { useUsuario } from '../context/UsuarioContext.jsx';
import { adicionarAoCarrinho, listarCarrinho, removerDoCarrinho, limparCarrinho } from '../services/carrinhoService';
import { criarVenda } from '../services/vendaService';
import { useNavigate } from 'react-router-dom';

export default function ProdutosPage() {
  const { usuario } = useUsuario();
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');

  // Debug user state
  useEffect(() => {
    console.log('Current user state:', usuario);
    console.log('LocalStorage user:', localStorage.getItem('usuario'));
  }, [usuario]);

  // Carrega carrinho do banco ao iniciar
  useEffect(() => {
    const userId = usuario?._id || usuario?.id;
    if (userId) {
      listarCarrinho(userId)
        .then(data => setCarrinho(data.itens || []))
        .catch(() => setCarrinho([]));
    }
  }, [usuario?._id, usuario?.id]);

  // Pega produtos do backend
  useEffect(() => {
    fetch('http://localhost:3000/api/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data))
      .catch(err => console.error(err));
  }, []);

  const adicionarCarrinho = async (produto) => {
    console.log('Função adicionarCarrinho chamada!', produto);
    // Use either _id or id, whichever is available
    const userId = usuario?._id || usuario?.id;
    console.log('userId:', userId);
    if (!userId) return message.error('Usuário não identificado');
    try {
      const data = await adicionarAoCarrinho(userId, produto);
      console.log('Resposta adicionarAoCarrinho:', data);
      if (data && Array.isArray(data.itens)) {
        setCarrinho(data.itens);
      } else if (Array.isArray(data.carrinho?.itens)) {
        setCarrinho(data.carrinho.itens);
      } else {
        message.error('Erro ao adicionar ao carrinho. Resposta inesperada.');
      }
    } catch (err) {
      message.error('Erro ao adicionar ao carrinho.');
      console.error(err);
    }
  };

  const removerCarrinho = async (produtoId) => {
    const userId = usuario?._id || usuario?.id;
    if (!userId) return;
    const data = await removerDoCarrinho(userId, produtoId);
    setCarrinho(data.itens || []);
  };

  const alterarQuantidade = async (produtoId, quantidade) => {
    const userId = usuario?._id || usuario?.id;
    if (!userId || quantidade < 1) return;
    // Remove e adiciona novamente com nova quantidade
    await removerCarrinho(produtoId);
    const produto = produtos.find(p => p._id === produtoId);
    if (produto) {
      await adicionarAoCarrinho(userId, { ...produto, quantidade });
      const data = await listarCarrinho(userId);
      setCarrinho(data.itens || []);
    }
  };

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div>
      <Card title="Produtos" style={{ marginBottom: 20 }}>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={produtos}
          renderItem={produto => (
            <List.Item>
              <Card
                title={produto.nome}
                extra={<Button onClick={() => adicionarCarrinho({ ...produto, quantidade: 1 })}>Adicionar</Button>}
              >
                <p>R$ {produto.preco.toFixed(2)}</p>
              </Card>
            </List.Item>
          )}
        />
      </Card>

      <Card title="Carrinho do Usuário" style={{ marginBottom: 20 }}>
        {carrinho.length === 0 && <p>Carrinho vazio</p>}
        <List
          dataSource={carrinho}
          renderItem={item => (
            <List.Item
              actions={[
                <Input
                  type="number"
                  value={item.quantidade}
                  min={1}
                  style={{ width: 60 }}
                  onChange={e => alterarQuantidade(item.produtoId, parseInt(e.target.value))}
                />,
                <Button danger onClick={() => removerCarrinho(item.produtoId)}>Remover</Button>
              ]}
            >
              {item.nome} - R$ {item.preco.toFixed(2)} cada
            </List.Item>
          )}
        />
        {carrinho.length > 0 && (
          <>
            <Divider />
            <div style={{ marginBottom: 16 }}>
              <h3>Total: R$ {total.toFixed(2)}</h3>
              <div style={{ marginBottom: 16 }}>
                <span style={{ marginRight: 8 }}>Forma de Pagamento:</span>
                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9',
                    marginRight: 16
                  }}
                >
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                </select>
              </div>
            </div>
            <Button type="primary" onClick={async () => {
              try {
                // Criar o objeto de venda
                const vendaData = {
                  cliente: {
                    _id: usuario._id,
                    nome: usuario.nome
                  },
                  produtos: carrinho.map(item => ({
                    produto: {
                      _id: item.produtoId,
                      nome: item.nome,
                      preco: item.preco
                    },
                    quantidade: item.quantidade
                  })),
                  formaPagamento: formaPagamento,
                  total: total
                };

                // Criar a venda
                await criarVenda(vendaData);

                // Limpar o carrinho
                await limparCarrinho(usuario._id);
                setCarrinho([]);

                message.success('Venda finalizada com sucesso!');

                // Redirecionar para a página de vendas
                navigate('/app/vendas');
              } catch (error) {
                console.error('Erro ao finalizar venda:', error);
                message.error('Erro ao finalizar venda. Por favor, tente novamente.');
              }
            }}>
              Finalizar Venda
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
