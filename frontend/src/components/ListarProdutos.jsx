import { useEffect, useState } from 'react';
import { fetchProdutos } from '../services/produtoService.js';

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetchProdutos()
      .then(setProdutos)
      .catch(err => console.error(err));
  }, []);

  return (
    <ul>
      {produtos.map(p => (
        <li key={p._id}>
          {p.nome} — R$ {p.preco.toFixed(2)}
        </li>
      ))}
    </ul>
  );
}
