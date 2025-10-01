import path from 'path';
import __dirname from '../utils/pathUtils.js';
import Produto from '../models/Produtos.js';

class ProdutoController{
    
    static async getAllProdutos(req, res){
        try{
            const produtos = await Produto.findAll();
            res.json(produtos); // retorna em json
        } catch(error){
            console.error('erro ao carregar os produtos', error);
            res.status(500).json({message:'Erro interno em buscar Produtos'})
        }
    }

    static async getProdutoById(req, res){
        try{
            const { id } = req.params; //parametros URL
            const produtoExistente = await Produto.findById(id);

            if(!produtoExistente){
                return res.status(404).json({ message: 'produto não encontrado'});
            }
            res.json(produtoExistente);
        } catch(error){
            console.error('erro ao carregar os produtos', error);
            res.status(500).json({message:'Erro interno em buscar Produtos'})
        }
    }

    static async createProduto(req, res) {
  try {
    const { cod, nome, preco, tipo, qtd } = req.body;

    if (!nome || !preco || !tipo || !qtd) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const produtoExistente = await Produto.findByNome(nome);
    if (produtoExistente) {
      return res.status(400).json({ message: 'Já existe um produto com esse nome' });
    }

    const novoProduto = new Produto({ cod, nome, preco, tipo, qtd });
    const salvo = await novoProduto.save();
    res.status(201).json(salvo);
  } catch (error) {
    console.error('Erro ao cadastrar o produto:', error);
    res.status(500).json({ message: 'Erro interno ao cadastrar o produto: ' + error.message });
  }
}

    
  static async updateProduto(req, res) {
    try {
      const { id } = req.params;
      const { nome, preco, tipo, qtd } = req.body;

      if (!nome || !preco || !tipo || !qtd) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      const produtoAtualizado = await Produto.findByIdAndUpdate(id, { nome, preco, tipo, qtd });

      if (!produtoAtualizado) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      res.json(produtoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error);
      res.status(500).json({ message: 'Erro interno ao atualizar o produto: ' + error.message });
    }
  }



    static async deleteProduto(req, res) {
  try {
    const { id } = req.params;
    console.log('[ProdutoController] Requisição de delete recebida para ID:', id);
    
    // Primeiro verifica se o produto existe
    console.log('[ProdutoController] Verificando se o produto existe...');
    const produto = await Produto.findById(id);
    
    if (!produto) {
      console.log('[ProdutoController] Produto não encontrado para deletar');
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    console.log('[ProdutoController] Produto encontrado:', produto);

    // Usa o método delete do modelo Produto
    console.log('[ProdutoController] Iniciando processo de deleção...');
    const deletado = await Produto.delete(id);
    console.log('[ProdutoController] Resultado da deleção:', deletado);
    
    if (deletado) {
      console.log('[ProdutoController] Produto deletado com sucesso');
      res.status(200).json({ message: 'Produto deletado com sucesso' });
    } else {
      console.log('[ProdutoController] Falha ao deletar produto');
      res.status(500).json({ message: 'Erro ao deletar produto' });
    }
  } catch (error) {
    console.error('[ProdutoController] Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro interno ao deletar produto: ' + error.message });
  }
}


    //renders da pagina web
    static async renderCreateProduto(req, res){
        try{
            res.sendFile(path.join(__dirname, 'views', 'CadastrarProdutos.html'));
        } catch(error){
            console.error('erro ao carregar a pagina', error);
            res.status(500).json({message:'Erro interno'});
      }
    }

    static async renderAllProdutos(req, res){
        try{
            const produtos = await Produto.findAll();
            //res.sendFile(path.join(__dirname, 'views', 'produtos.html'));
            res.render('VisualizarProdutos', { produtos: produtos }); // renderiza a view produtos.ejs passando os produtos
        }catch(error){
            console.error('erro ao carregar a pagina', error);
            res.status(500).json({message:'Erro interno'});
        }
    }
}

export default ProdutoController;