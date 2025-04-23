import produtoModel from './ProdutoSchema.js';


class Produto {
    constructor(nome, preco) {
        this.nome = nome;
        this.preco = preco;
    }

    async save() {
        const novoProduto = new produtoModel({
            nome: this.nome,
            preco: this.preco
        });
        return await novoProduto.save();
    }

    static async findAll() {
        return await produtoModel.find();
    }

    static async findById(id) {
        return await produtoModel.findById(id);
    }

    static async findByNome(nome) {
        return await produtoModel.findOne({ nome: nome });
    }

    static async delete(id) {
        return await produtoModel.findByIdAndDelete(id);
    }
}

export default Produto;