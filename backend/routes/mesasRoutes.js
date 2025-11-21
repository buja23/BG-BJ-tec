import express from 'express';
import { getMesas, abrirMesa, adicionarProduto, fecharMesa, abrirMesaEspecifica, removerProduto } from '../controllers/MesaController.js';

const router = express.Router();

router.use(express.json());

router.get('/', getMesas);
router.post('/', abrirMesa); // Rota padrão POST para criar/reutilizar uma mesa
router.put('/:mesaId/abrir', abrirMesaEspecifica); // Nova rota para abrir uma mesa específica
router.post('/:mesaId/adicionar', adicionarProduto);
router.delete('/:mesaId/produtos/:produtoConsumidoId', removerProduto); // Nova rota para remover produto
router.post('/:mesaId/fechar', fecharMesa);

export default router;
