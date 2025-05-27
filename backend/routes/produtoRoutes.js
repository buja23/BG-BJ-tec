// backend/src/routes/produtoRoutes.js

import express from "express";
import controle from "../controllers/ProdutoController.js";

const router = express.Router();

// Rota base será /api/produtos
router.get('/', controle.getAllProdutos);
router.get('/:id', controle.getProdutoById);
router.post('/', controle.createProduto);
router.put('/:id', controle.updateProduto);
router.delete('/:id', controle.deleteProduto);

export default router;
