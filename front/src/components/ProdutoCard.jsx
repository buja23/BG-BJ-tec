import React from 'react';
import { useCarrinho } from '../context/CarrinhoContext';
import { adicionarAoCarrinho } from '../services/carrinhoService';

const ProdutoCard = ({ produto, usuarioId }) => {
  const { setItens } = useCarrinho();

  const handleAdicionar = async () => {
    const carrinhoAtualizado = await adicionarAoCarrinho(usuarioId, produto);
    setItens(carrinhoAtualizado.itens);
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
      <h3>{produto.nome}</h3>
      <p>R$ {produto.preco}</p>
      <button onClick={handleAdicionar}>Adicionar ao Carrinho</button>
    </div>
  );
};

export default ProdutoCard;
