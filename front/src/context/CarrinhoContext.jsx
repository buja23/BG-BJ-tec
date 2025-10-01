import { createContext, useContext, useState, useEffect } from 'react';
import { listarCarrinho } from '../services/carrinhoService';

const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children, usuarioId }) => {
  const [itens, setItens] = useState([]);

  // Buscar carrinho ao logar
  useEffect(() => {
    const fetchCarrinho = async () => {
      if (!usuarioId) return;
      const carrinho = await listarCarrinho(usuarioId);
      setItens(carrinho.itens || []);
    };
    fetchCarrinho();
  }, [usuarioId]);

  return (
    <CarrinhoContext.Provider value={{ itens, setItens }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);
