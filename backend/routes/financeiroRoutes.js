import express from 'express';
import { getRelatorioFinanceiro } from '../controllers/FinanceiroController.js';

const router = express.Router();

// Rota principal para obter o relatório financeiro
router.get('/relatorio', getRelatorioFinanceiro);

export default router;