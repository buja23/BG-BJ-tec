import { Produto } from './Produtos.js';

export class Comida extends Produto {
  constructor() {
    super('Comida', 20.00);
  }
}
