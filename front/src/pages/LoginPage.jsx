import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useUsuario } from '../context/UsuarioContext.jsx';
import '../cadastro.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const { login } = useUsuario(); // pega a função do contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ type: '', text: '' });

    try {
      // Passa a função de navegação para o contexto, que cuidará do redirecionamento
      await login(email, senha, navigate);
    } catch (error) {
      console.error('Falha na requisição:', error);
      const errorMsg = error.response?.data?.message || 'E-mail ou senha inválidos.';
      setMensagem({ type: 'erro', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <ThemeToggle />
      <div className="card">
        <h2>Login de Acesso</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        {mensagem.text && (
          <p className={`mensagem ${mensagem.type}`}>
            {mensagem.text}
          </p>
        )}
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Não tem uma conta? <Link to="/cadastro">Cadastre-se!</Link>
        </p>
      </div>
    </div>
  );
}
