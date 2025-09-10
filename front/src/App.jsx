import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';

function App() {
  // Agora o componente só define as rotas, sem um roteador próprio.
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;