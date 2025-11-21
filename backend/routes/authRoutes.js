import express from 'express';
import { login, register } from '../controllers/AuthController.js';

const router = express.Router();

// Aplica o middleware express.json() APENAS para as rotas que recebem JSON.
router.post('/login', express.json(), login);
router.post('/register', express.json(), register); // Assumindo que você também tem uma rota de registro

export default router;