import express from 'express';
import { createVenda, getAllVendas, getVendaById, getVendasByPeriod, getVendasByUser } from '../controllers/VendaController.js';

const router = express.Router();

// Rota base: /api/vendas
console.log('Rotas de venda carregadas');
router.post('/criar', createVenda);
router.get('/', getAllVendas);
router.get('/periodo', getVendasByPeriod);
router.get('/usuario/:usuarioId', getVendasByUser);
router.get('/:id', getVendaById);

export default router;