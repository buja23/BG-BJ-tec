 import express from "express";
 import controle from "../controllers/ProdutoController.js";

 const router = express.Router();

//Funçoes

 // get todos os produtos
    router.get('/produtos', controle.getAllProdutos);

    
    // get por ID
    router.get('/produtos/:id', controle.getProdutoById);
    
    // POST novo produto - form
    router.post('/produtos', controle.createProduto);
    
    // put atualizar produto por ID
    router.put('/produtos/:id', controle.updateProduto);
    
    //delete produto por id
    router.delete('/produtos/:id', controle.deleteProduto);

    router.get('/produtosCad', controle.renderCreateProduto);

    router.get('/produtosVisu', controle.renderAllProdutos);


    export default router;
