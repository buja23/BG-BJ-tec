import React, { useEffect, useState } from 'react';
import { Card, Button, Input, List, Divider } from 'antd';
import { useUsuario } from '../context/UsuarioContext.jsx';

export default function ProdutosPage() {
  const { usuario } = useUsuario();
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);

  // Carrega carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem(`carrinho_${usuario._id}`);
    if (savedCart) setCarrinho(JSON.parse(savedCart));
  }, [usuario._id]);

  // Salva carrinho no localStorage sempre que ele muda
  useEffect(() => {
    localStorage.setItem(`carrinho_${usuario._id}`, JSON.stringify(carrinho));
  }, [carrinho, usuario._id]);

  // Pega produtos do backend
  useEffect(() => {
    fetch('http://localhost:3000/api/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data))
      .catch(err => console.error(err));
  }, []);

  const adicionarCarrinho = (produto) => {
    setCarrinho(prev => {
      const exists = prev.find(item => item._id === produto._id);
      if (exists) {
        return prev.map(item =>
          item._id === produto._id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      } else {
        return [...prev, { ...produto, quantidade: 1 }];
      }
    });
  };

  const removerCarrinho = (produtoId) => {
    setCarrinho(prev => prev.filter(item => item._id !== produtoId));
  };

  const alterarQuantidade = (produtoId, quantidade) => {
    if (quantidade < 1) return;
    setCarrinho(prev =>
      prev.map(item =>
        item._id === produtoId ? { ...item, quantidade } : item
      )
    );
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
                extra={<Button onClick={() => adicionarCarrinho(produto)}>Adicionar</Button>}
              >
                <p>R$ {produto.preco.toFixed(2)}</p>
              </Card>
            </List.Item>
          )}
        />
      </Card>

      <Card title="Carrinho">
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
                  onChange={e => alterarQuantidade(item._id, parseInt(e.target.value))}
                />,
                <Button danger onClick={() => removerCarrinho(item._id)}>Remover</Button>
              ]}
            >
              {item.nome} - R$ {item.preco.toFixed(2)} cada
            </List.Item>
          )}
        />
        {carrinho.length > 0 && (
          <>
            <Divider />
            <h3>Total: R$ {total.toFixed(2)}</h3>
            <Button type="primary" onClick={() => alert('Compra efetuada!')}>
              Finalizar Compra
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
