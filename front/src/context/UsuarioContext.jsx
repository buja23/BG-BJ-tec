import { createContext, useContext, useState, useEffect } from 'react';

const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    // Tenta recuperar usuário do localStorage
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  });

  // Salva usuário no localStorage sempre que mudar
  useEffect(() => {
    if (usuario) localStorage.setItem('usuario', JSON.stringify(usuario));
    else localStorage.removeItem('usuario');
  }, [usuario]);

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => useContext(UsuarioContext);
