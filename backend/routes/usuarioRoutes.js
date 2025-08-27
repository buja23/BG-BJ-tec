import express from 'express';
import controle from '../controllers/UsuarioController.js';

const router = express.Router();

router.post('/', controle.create);
router.get('/', controle.list);
router.get('/:id', controle.getById);
router.put('/:id', controle.update);
router.delete('/:id', controle.remove);

// 🚀 Rota de login
router.post('/', controle.login);

export default router;
