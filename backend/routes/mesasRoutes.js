import express from 'express';
import {
  abrirMesa,
  adicionarProduto,
  fecharMesa,
  listarMesas,
  detalharMesa,
  removerMesa
} from '../controllers/MesaController.js';


const router = express.Router();

router.post('/', abrirMesa);
router.put('/:id/adicionar-produto', adicionarProduto);
router.put('/:id/fechar', fecharMesa);
router.get('/', listarMesas);
router.get('/:id', detalharMesa);
router.delete('/:id', removerMesa);

export default router;
