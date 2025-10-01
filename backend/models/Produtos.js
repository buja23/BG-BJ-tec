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
    console.log('[Produto Model] Tentando deletar produto com ID:', id);
    try {
      const resultado = await produtoModel.findByIdAndDelete(id);
      console.log('[Produto Model] Resultado da deleção:', resultado);
      return resultado;
    } catch (error) {
      console.error('[Produto Model] Erro ao deletar:', error);
      throw error;
    }
  }

  static async deleteByCod(cod) {
    console.log('[Produto Model] Tentando deletar produto com código:', cod);
    try {
      const resultado = await produtoModel.findOneAndDelete({ cod });
      console.log('[Produto Model] Resultado da deleção por código:', resultado);
      return resultado;
    } catch (error) {
      console.error('[Produto Model] Erro ao deletar por código:', error);
      throw error;
    }
  }

  static async update(id, update) {
    return await produtoModel.findByIdAndUpdate(id, update, { new: true });
  }

  static async findByCod(cod) {
    return await produtoModel.findOne({ cod });
  }

  static async findByIdAndUpdate(id, update) {
    return await produtoModel.findByIdAndUpdate(id, update, { new: true });
  }

  static async findByIdAndDelete(id) {
    return await produtoModel.findByIdAndDelete(id);
  }
}

export default Produto;
