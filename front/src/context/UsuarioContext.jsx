import { createContext, useContext, useState, useEffect } from 'react';

const UsuarioContext = createContext();

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const usuarioStorage = localStorage.getItem('usuario');
    console.log('Loading user from storage:', usuarioStorage);
    if (usuarioStorage) {
      const parsedUser = JSON.parse(usuarioStorage);
      console.log('Parsed user:', parsedUser);
      setUsuario(parsedUser);
    }
  }, []);

  const login = (usuarioData) => {
    console.log('Login called with data:', usuarioData);
    // Normalize the user object to ensure it has _id
    const normalizedUser = {
      ...usuarioData,
      _id: usuarioData._id || usuarioData.id
    };
    setUsuario(normalizedUser);
    localStorage.setItem('usuario', JSON.stringify(normalizedUser));
    console.log('Saved user to localStorage:', JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  return (
    <UsuarioContext.Provider value={{ usuario, login, logout }}>
      {children}
    </UsuarioContext.Provider>
  );
}

export const useUsuario = () => useContext(UsuarioContext);
