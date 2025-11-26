import express from 'express';
import { processarPagamento } from '../controllers/PagamentoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/processar', protect, processarPagamento);

export default router;