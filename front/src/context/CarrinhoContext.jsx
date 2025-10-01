// src/context/CarrinhoContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CarrinhoContext = createContext();

export const useCarrinho = () => useContext(CarrinhoContext);

export const CarrinhoProvider = ({ children }) => {
  const [itens, setItens] = useState([]);

  // Carregar carrinho do localStorage no início
  useEffect(() => {
    const savedCart = localStorage.getItem('carrinho');
    if (savedCart) setItens(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens));
  }, [itens]);

  const adicionarItem = (produto) => {
    setItens((prev) => [...prev, produto]);
  };

  const removerItem = (produtoId) => {
    setItens((prev) => prev.filter((p) => p.id !== produtoId));
  };

  const limparCarrinho = () => setItens([]);

  return (
    <CarrinhoContext.Provider value={{ itens, adicionarItem, removerItem, limparCarrinho }}>
      {children}
    </CarrinhoContext.Provider>
  );
};
