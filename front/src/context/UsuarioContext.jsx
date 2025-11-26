import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Importa a instância do axios
import { useNavigate } from 'react-router-dom';

const UsuarioContext = createContext();

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  // Carregar usuário do localStorage ao iniciar
  // O hook de navegação não pode ser usado aqui diretamente, mas será usado no login/logout
  useEffect(() => {
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      const parsedUser = JSON.parse(usuarioStorage);
      // Configura o token no axios ao carregar
      api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      setUsuario(parsedUser.user);
    }
  }, []);

  const login = async (email, senha, navigate) => {
    // A função de login agora faz a chamada à API
    const response = await api.post('/auth/login', { email, senha });
    const { user, token } = response.data;

    // Salva o usuário e o token no localStorage
    const dataToStore = { user, token };
    localStorage.setItem('usuario', JSON.stringify(dataToStore));

    // Configura o token no header do axios para futuras requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Atualiza o estado global do usuário
    setUsuario(user);

    // Redireciona para a página principal APÓS o estado ser atualizado
    navigate('/app/mesas');
  };

  const logout = (navigate) => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    delete api.defaults.headers.common['Authorization'];
    // Redireciona para a página de login após o logout
    navigate('/login');
  };

  return (
    <UsuarioContext.Provider value={{ usuario, login, logout }}>
      {children}
    </UsuarioContext.Provider>
  );
}

export const useUsuario = () => useContext(UsuarioContext);
