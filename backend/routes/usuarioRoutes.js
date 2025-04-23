// routes/usuarioRoutes.js
import express from 'express';
import controle from '../controllers/UsuarioController.js';

const router = express.Router();

// POST   /api/usuarios      → cria um usuário
router.post('/usuario', controle.create);

// GET    /api/usuarios      → lista todos
router.get('/usuario', controle.list);

// GET    /api/usuarios/:id  → busca por ID
router.get('/usuario:id', controle.getById);

// PUT    /api/usuarios/:id  → atualiza usuário
router.put('/usuario:id', controle.update);

// DELETE /api/usuarios/:id  → remove usuário
router.delete('/usuario:id', controle.remove);

router.get('/cadastrar', (req, res) => {
    res.render('cadastrarUsuario');
  });

export default router;
