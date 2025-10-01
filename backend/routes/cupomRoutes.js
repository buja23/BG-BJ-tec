import express from 'express';
import CupomController from '../controllers/CupomController.js';
import { aplicarCupom } from '../controllers/CupomMesaController.js';

const router = express.Router();

router.get('/', CupomController.listarCupons);
router.post('/', CupomController.criarCupom);
router.put('/:id', CupomController.atualizarCupom);
router.delete('/:id', CupomController.removerCupom);
router.post('/validar', CupomController.validarCupom);
router.post('/aplicar', aplicarCupom);

export default router;
