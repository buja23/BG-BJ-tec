import express from 'express';
import * as VendaController from '../controllers/VendaController.js';

const router = express.Router();

router.post('/criar', VendaController.createVenda);
router.get('/', VendaController.getAllVendas);
router.get('/usuario/:usuarioId', VendaController.getVendasByUser);

export default router;