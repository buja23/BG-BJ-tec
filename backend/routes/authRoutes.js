import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js'; // Importa a classe controller

const router = express.Router();

// O middleware express.json() já é global no server.js
router.post('/login', UsuarioController.login); // Chama o método estático 'login'
router.post('/register', UsuarioController.create); // Chama o método estático 'create'

export default router;