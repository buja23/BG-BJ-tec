import express from 'express';
import { login } from '../controllers/AuthController.js'; // Importa a função de login

const router = express.Router();

// Define a rota para o método POST em /login
// Quando uma requisição chegar aqui, ela chamará a função 'login' do AuthController
router.post('/login', login);

export default router;