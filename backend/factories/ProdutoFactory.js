// produtoFactory.js
import produtoModel from './ProdutoSchema.js';

class ProdutoFactory {
  static criarProduto(dados) {
    const tiposValidos = ['comida', 'cerveja', 'dose', 'drink', 'sorvete', 'refrigerante'];

    if (!tiposValidos.includes(dados.tipo)) {
      throw new Error(`Tipo inválido. Os tipos válidos são: ${tiposValidos.join(', ')}`);
    }

    return new produtoModel(dados);
  }
}

export default ProdutoFactory;
