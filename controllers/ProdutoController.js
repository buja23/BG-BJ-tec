import path from 'path';
import __dirname from '../utils/pathUtils.js';
import Produto from '../models/produto.js';

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

    static async createProduto(req, res){
        try{
            const {nome, preco} = req.body;
            const produtoExistente = await Produto.findByNome(nome);

            if(produtoExistente){
                return res.static(400).json({ message: 'ja existe um produto com esse nome'})
            }
            else{
                const novoProduto = new produtoExistente(nome, preco);
                await novoProduto.save();
                res.status(201).json(novoProduto);
            } 
        }catch(error){
            console.error('erro ao carregar os produtos', error);
            res.status(500).json({message:'Erro interno em buscar Produtos'});
        }
    }
    static async updateProduto(req, res){

    }


    static async deleteProduto(req, res){

    }

    //renders da pagina web
    static async renderCreateProduto(req, res){
        try{
            res.sendFile(path.join(__dirname, 'views', 'cadrastrarProdutos.html'));
        } catch(error){
            console.error('erro ao carregar a pagina', error);
            res.status(500).json({message:'Erro interno'});
      }
    }

    static async renderAllCarros(req, res){
        try{
            const produtos = await Produto.findAll();
            res.sendFile(path.join(__dirname, 'views', 'produtos.html'));
        }catch(error){
            console.error('erro ao carregar a pagina', error);
            res.status(500).json({message:'Erro interno'});
        }
    }
}

export default ProdutoController;