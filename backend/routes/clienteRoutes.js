import express from 'express';
import {
  createCliente,
  getClientes,
  updateCliente,
  deleteCliente
} from '../controllers/ClienteController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Mapeia as rotas para as funções do controller
router.post('/', protect, authorize('gerente', 'caixa', 'garcom'), createCliente); // Todos podem criar clientes
router.get('/', protect, getClientes);         // Todos podem ver
router.put('/:id', protect, authorize('gerente', 'caixa', 'garcom'), updateCliente);      // Todos podem editar
router.delete('/:id', protect, authorize('gerente'), deleteCliente); // Apenas gerente pode deletar

export default router;