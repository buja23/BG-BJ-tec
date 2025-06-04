import { useState, useEffect } from "react";
import { fetchProdutos, createProduto } from "../services/produtoService";
import ListaProdutos from "../components/ListarProdutos"; // Certifique-se do nome estar correto
import { ProdutoFactory } from "../../../backend/factories/ProdutoFactory"; // ajuste o caminho conforme necessário

export default function Home() {
  const [cod, setCod] = useState('');
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [tipo, setTipo] = useState('comida');
  const [qtd, setQtd] = useState('');
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetchProdutos()
      .then(produtos => {
        setProdutos(produtos);
        gerarCod(produtos);
      })
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }, []);

  const gerarCod = (lista) => {
    const ultimoCod = lista.length ? parseInt(lista[lista.length - 1].cod) : 0;
    const novoCod = (ultimoCod + 1).toString().padStart(4, '0');
    setCod(novoCod);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const produto = ProdutoFactory.criarProduto(tipo);
      produto.cod = cod;
      produto.nome = nome;
      produto.preco = parseFloat(preco);
      produto.qtd = parseInt(qtd);

      const novo = await createProduto(produto);

      const novaLista = [...produtos, novo];
      setProdutos(novaLista);
      alert("Produto cadastrado com sucesso!");

      setNome('');
      setPreco('');
      setTipo('comida');
      setQtd('');
      gerarCod(novaLista);
    } catch (err) {
      console.error("Erro ao criar produto:", err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Cadastro de Produtos</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Código"
          value={cod}
          disabled
        />
        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Preço"
          step="0.01"
          value={preco}
          onChange={e => setPreco(e.target.value)}
          required
        />
        <select value={tipo} onChange={e => setTipo(e.target.value)} required>
          <option value="comida">Comida</option>
          <option value="refrigerante">Refrigerante</option>
          <option value="sorvete">Sorvete</option>
          <option value="cerveja">Cerveja</option>
          <option value="dose">Dose</option>
          <option value="drink">Drink</option>
        </select>
        <input
          type="number"
          placeholder="Quantidade"
          value={qtd}
          onChange={e => setQtd(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>

      <h2>Lista de Produtos</h2>
      <ListaProdutos produtos={produtos} />
    </div>
  );
}
