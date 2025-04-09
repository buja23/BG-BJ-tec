 import express from "express";
 import controle from "../controllers/ProdutoController.js";

 const router = express.Router();

//Funçoes

 // get todos os produtos
    router.get('/Produtos', controle.getAllProdutos);

 // get por ID
    router.get('/Produtos/:id', controle.getProdutoById);

 // POST novo produto - form
    router.post('/Produtos', controle.createProduto);

// put atualizar produto por ID
    router.put('/Produtos/:id', controle.updateProduto);

//delete produto por id
    router.delete('/Produtos/:id', controle.deleteProduto);


    export default router;
