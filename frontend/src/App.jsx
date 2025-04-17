import './App.css'

function App() {

  return (
    <>
    <h1>Cadrastrar Produtos</h1>
      <div>
      <form action="/Produtos" method="POST">
        <input type="text" name="nome" id="nome" placeholder="Nome do Produto" required />
        <input type="number" name="preco" id="preco" placeholder="Preço do Produto" step="0.01" required />
        <button type="submit">Cadastrar</button>
    </form>
    </div>
    </>
  )
}

export default App
