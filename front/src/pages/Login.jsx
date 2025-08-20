import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert(`Bem-vindo, ${data.usuario.nome}!`);
      // 👉 aqui você pode redirecionar, por exemplo:
      // window.location.href = "/dashboard";
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert("Erro ao conectar com o servidor");
  }
};

  return (
    <div className="card">
      <h2>Bem-vindo</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
