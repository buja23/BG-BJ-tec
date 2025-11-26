import express from 'express';
import {
  createCupom,
  getCupons,
  updateCupom,
  deleteCupom,
  validarCupom
} from '../controllers/CupomController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Mapeia as rotas para as funções do controller
router.post('/', protect, authorize('gerente'), createCupom);
router.get('/', protect, getCupons);
router.put('/:id', protect, authorize('gerente'), updateCupom);
router.delete('/:id', protect, authorize('gerente'), deleteCupom);

// Rota específica para validação
router.post('/validar', protect, validarCupom);

export default router;