import { useState } from "react";
import { Link } from "react-router-dom"; // Importa o componente de Link

export default function CadastroForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("garcom"); // valor padrão
  const [mensagem, setMensagem] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, cargo }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem(`Usuário ${data.nome} cadastrado com sucesso!`);
        setNome("");
        setEmail("");
        setSenha("");
        setCargo("garcom");
      } else {
        setMensagem(data.error || "Erro ao cadastrar usuário");
      }
    } catch (error) {
      console.log("erro"); // console monstra essa linha no console
      setMensagem("Erro ao conectar com o servidor");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="card">
        <h2>Cadastrar Usuário</h2>
        <form onSubmit={handleCadastro}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
            <option value="garcom">Garçom</option>
            <option value="caixa">Caixa</option>
            <option value="gerente">Gerente</option>
          </select>
          <button type="submit">Cadastrar</button>
        </form>

        {mensagem && <p>{mensagem}</p>}

     
        <p>
          Já tem Cadastro? <Link to="/Login">Faça o Login!</Link>
        </p>
      </div>
    </div>
  );
}