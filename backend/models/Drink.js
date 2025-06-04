import { Produto } from './Produtos.js';

export class Drink extends Produto {
  constructor() {
    super('Drink', 15.00);
  }
}
