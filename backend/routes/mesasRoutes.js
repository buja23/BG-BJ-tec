import express from 'express';
import { getMesas, abrirMesa, adicionarProduto, fecharMesa, abrirMesaEspecifica, removerProduto, vincularCliente, desvincularCliente } from '../controllers/MesaController.js';
import { protect } from '../middleware/authMiddleware.js'; // 1. Importar o middleware de proteção

const router = express.Router();

// 2. Aplicar o 'protect' em todas as rotas para garantir que apenas usuários logados possam acessá-las.
router.get('/', protect, getMesas);
router.post('/', protect, abrirMesa);
router.post('/:mesaId/abrir', protect, abrirMesaEspecifica);
router.post('/:mesaId/adicionar', protect, adicionarProduto);
router.delete('/:mesaId/produtos/:produtoConsumidoId', protect, removerProduto);
router.post('/:mesaId/fechar', protect, fecharMesa);

// Rotas para vincular e desvincular clientes
router.post('/:mesaId/vincular-cliente', protect, vincularCliente); // 3. Padronizado para POST
router.post('/:mesaId/desvincular-cliente', protect, desvincularCliente);

export default router;
