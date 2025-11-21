import express from 'express';
import { getStatusAtual, abrirCaixa, fecharCaixa, getHistorico } from '../controllers/CaixaController.js';

const router = express.Router();

// Aplica o middleware de parsing de JSON para todas as rotas de caixa
router.use(express.json());

router.get('/status', getStatusAtual);
router.get('/historico', getHistorico);
router.post('/abrir', abrirCaixa);
router.post('/fechar', fecharCaixa);

export default router;
