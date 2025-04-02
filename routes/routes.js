 import express from "express";
 import controle from "../controllers/controle.js";

 const router = express.Router();

//Funçoes

 // get todos os produtos
    router.get('/Produtos', ProdutoController.getAllProdutos);

 // get por ID
    router.get('/Produtos/:id', ProdutoController.getProdutoById);

 // POST novo produto - form
    router.post('/Produtos', ProdutoController.createProduto);

// put atualizar produto por ID
    router.put('/Produtos/:id', ProdutoController.updateProduto);

//delete produto por id
    router.delete('/Produtos/:id', ProdutoController.deleteProduto);

    export default router;
