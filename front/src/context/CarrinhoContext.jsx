import React, { createContext, useContext, useState } from 'react';
import { criarVenda } from '../services/vendaService';
import { useUsuario } from './UsuarioContext';
import { message } from 'antd';

const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarProduto = (produto) => {
    // se já existir no carrinho, só incrementa a quantidade
    const existente = carrinho.find((p) => p._id === produto._id);
    if (existente) {
      setCarrinho(
        carrinho.map((p) =>
          p._id === produto._id ? { ...p, qtd: p.qtd + produto.qtd } : p
        )
      );
    } else {
      setCarrinho([...carrinho, produto]);
    }
  };

  const removerProduto = (_id) => {
    setCarrinho(carrinho.filter((p) => p._id !== _id));
  };

  const limparCarrinho = () => setCarrinho([]);

  const { usuario } = useUsuario();
  
  const finalizarVenda = async (formaPagamento) => {
    try {
      console.log('Iniciando finalização da venda...');
      
      if (!usuario) {
        message.error('Usuário não está logado');
        return false;
      }

      if (carrinho.length === 0) {
        message.error('Carrinho está vazio');
        return false;
      }

      const total = carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
      
      const vendaData = {
        data: new Date(),
        cliente: {
          _id: usuario._id,
          nome: usuario.nome
        },
        produtos: carrinho.map(item => ({
          produto: {
            _id: item._id,
            nome: item.nome,
            preco: Number(item.preco)
          },
          quantidade: Number(item.qtd || 1),
          subtotal: Number(item.preco) * Number(item.qtd || 1)
        })),
        formaPagamento,
        total: total,
        status: 'concluida'
      };

      console.log('Dados da venda a serem enviados:', vendaData);

      const resultado = await criarVenda(vendaData);
      console.log('Resposta da criação da venda:', resultado);
      
      if (resultado) {
        limparCarrinho();
        message.success('Venda finalizada com sucesso!');
        return true;
      }
      
      throw new Error('Erro ao criar venda: sem resposta do servidor');
    } catch (error) {
      console.error('Erro ao finalizar venda:', error.response?.data || error.message);
      message.error('Erro ao finalizar venda: ' + (error.response?.data?.message || error.message));
      return false;
    }
  };

  return (
    <CarrinhoContext.Provider value={{ 
      carrinho, 
      adicionarProduto, 
      removerProduto, 
      limparCarrinho,
      finalizarVenda
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);
