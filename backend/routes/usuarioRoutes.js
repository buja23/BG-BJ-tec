import express from 'express';
import controle from '../controllers/UsuarioController.js';

const router = express.Router();

router.post('/usuario', controle.create);
router.get('/usuario', controle.list);
router.get('/usuario/:id', controle.getById);
router.put('/usuario/:id', controle.update);
router.delete('/usuario/:id', controle.remove);

// 🚀 Rota de login
router.post('/login', controle.login);

export default router;
