import path from 'path';
import __dirname from '../utils/pathUtils.js';
import fs from 'fs';
import ProdutoModel from '../models/ProdutoSchema.js';

export const getAllProdutos = async (req, res, next) => {
    try{
        const produtos = await ProdutoModel.find();
        res.json(produtos); // retorna em json
    } catch(error){
        console.error('erro ao carregar os produtos', error);
        next(error);
    }
};

export const getProdutoById = async (req, res, next) => {
    try{
        const { id } = req.params; //parametros URL
        const produtoExistente = await ProdutoModel.findById(id);

        if(!produtoExistente){
            return res.status(404).json({ message: 'produto não encontrado'});
        }
        res.json(produtoExistente);
    } catch(error){
        console.error('erro ao buscar o produto por ID', error);
        next(error);
    }
};

export const createProduto = async (req, res, next) => {
    try {
        // LOG DE DEPURAÇÃO: Essencial para diagnosticar problemas de upload.
        console.log('--- REQUISIÇÃO createProduto ---');
        console.log('Corpo da requisição (req.body):', req.body);
        console.log('Arquivo recebido (req.file):', req.file);
        console.log('---------------------------------');

        const { nome, preco, tipo, qtd, custo } = req.body; // 1. Extrair o 'custo'

        if (!nome || !preco || !tipo || !qtd || !custo) { // 2. Adicionar 'custo' à validação
            return res.status(400).json({ message: 'Todos os campos (nome, preco, tipo, qtd, custo) são obrigatórios.' });
        }

        // Constrói a URL da imagem se um arquivo foi enviado
        let imagemUrl = null;
        if (req.file) {
            imagemUrl = `/uploads/${req.file.filename}`;
        }
        
        const produtoData = {
            nome,
            preco: parseFloat(preco),
            tipo,
            qtd: parseInt(qtd, 10),
            custo: parseFloat(custo), // 3. Adicionar 'custo' ao objeto de dados
            imagemUrl,
        };
        
        // 1. Cria uma nova instância do modelo, mas ainda não salva no banco.
        const novoProduto = new ProdutoModel(produtoData);

        // 2. Gera o código a partir do _id (que o Mongoose já cria na instância)
        novoProduto.cod = novoProduto._id.toString().slice(-6).toUpperCase();
        
        // 3. Agora salva o documento completo (com o 'cod') no banco.
        const salvo = await novoProduto.save(); 

        res.status(201).json(salvo);
    } catch (error) {
        console.error('Erro ao cadastrar o produto:', error);
        next(error);
    }
};

export const updateProduto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        const produtoExistente = await ProdutoModel.findById(id);
        if (!produtoExistente) {
            return res.status(404).json({ message: 'Produto para atualizar não encontrado' });
        }

        // Se uma nova imagem for enviada, atualiza o caminho e remove a antiga
        if (req.file) {
            console.log('Nova imagem recebida para atualização:', req.file.filename);
            if (produtoExistente.imagemUrl) {
                const oldImagePath = path.join(__dirname, '..', 'public', produtoExistente.imagemUrl);
                if (fs.existsSync(oldImagePath)) {
                    console.log('Removendo imagem antiga:', oldImagePath);
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.imagemUrl = `/uploads/${req.file.filename}`;
        }

        const produtoAtualizado = await ProdutoModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!produtoAtualizado) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(produtoAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        next(error);
    }
};

export const deleteProduto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const produto = await ProdutoModel.findByIdAndDelete(id);
        
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        
        if (produto.imagemUrl) {
            const imagePath = path.join(__dirname, '..', 'public', produto.imagemUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        next(error);
    }
};