// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext.jsx';

export default function PrivateRoute() {
  const { usuario } = useUsuario();
  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}
