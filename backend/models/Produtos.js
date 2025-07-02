// Produto.js
import produtoModel from './ProdutoSchema.js';

class Produto {
  constructor({ cod, nome, preco, tipo, qtd }) {
    this.cod = cod;
    this.nome = nome;
    this.preco = preco;
    this.tipo = tipo;
    this.qtd = qtd;
  }

  async save() {
    const novoProduto = new produtoModel({
      cod: this.cod,
      nome: this.nome,
      preco: this.preco,
      tipo: this.tipo,
      qtd: this.qtd
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
    return await produtoModel.findOne({ nome });
  }

  static async delete(id) {
    return await produtoModel.findByIdAndDelete(id);
  }

  static async deleteByCod(cod) {
    return await produtoModel.findOneAndDelete({ cod });
  }

  static async updateByCod(cod, update) {
    return await produtoModel.findOneAndUpdate({ cod }, update, { new: true });
  }

  static async findByCod(cod) {
    return await produtoModel.findOne({ cod });
  }
}

export default Produto;
