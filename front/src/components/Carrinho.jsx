import React from 'react';
import { useCarrinho } from '../context/CarrinhoContext';
import { removerDoCarrinho, limparCarrinho } from '../services/carrinhoService';

const Carrinho = ({ usuarioId }) => {
  const { itens, setItens } = useCarrinho();

  const handleRemover = async (produtoId) => {
    const carrinhoAtualizado = await removerDoCarrinho(usuarioId, produtoId);
    setItens(carrinhoAtualizado.itens);
  };

  const handleLimpar = async () => {
    const carrinhoAtualizado = await limparCarrinho(usuarioId);
    setItens(carrinhoAtualizado.itens);
  };

  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div>
      <h2>Carrinho de Compras</h2>
      {itens.length === 0 && <p>Carrinho vazio</p>}
      <ul>
        {itens.map(item => (
          <li key={item.produtoId}>
            {item.nome} x {item.quantidade} - R$ {item.preco * item.quantidade}
            <button onClick={() => handleRemover(item.produtoId)}>Remover</button>
          </li>
        ))}
      </ul>
      <p>Total: R$ {total}</p>
      {itens.length > 0 && <button onClick={handleLimpar}>Limpar Carrinho</button>}
    </div>
  );
};

export default Carrinho;
