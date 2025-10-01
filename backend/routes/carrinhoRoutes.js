import express from 'express';
import {
  adicionarAoCarrinho,
  removerDoCarrinho,
  limparCarrinho,
  listarCarrinho
} from '../controllers/CarrinhoController.js';

const router = express.Router();

router.post('/adicionar', adicionarAoCarrinho);
router.post('/remover', removerDoCarrinho);
router.post('/limpar', limparCarrinho);
router.get('/:usuarioId', listarCarrinho);

export default router;
