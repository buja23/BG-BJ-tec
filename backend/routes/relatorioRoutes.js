import express from 'express';
import { exportarVendas } from '../controllers/RelatorioController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/vendas/:formato', protect, authorize('gerente'), exportarVendas);

export default router;