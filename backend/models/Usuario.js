import Usuario from './UsuarioClass.js';

export class Garcom extends Usuario {
  constructor(nome, email, senha) {
    super(nome, email, senha);
    this.cargo = 'garcom';
  }
  anotarPedido() {
    console.log(`${this.nome} anotou um pedido.`);
  }
}

export class Caixa extends Usuario {
  constructor(nome, email, senha) {
    super(nome, email, senha);
    this.cargo = 'caixa';
  }
  fecharCaixa() {
    console.log(`${this.nome} fechou o caixa.`);
  }
}

export class Gerente extends Usuario {
  constructor(nome, email, senha) {
    super(nome, email, senha);
    this.cargo = 'gerente';
  }
  verRelatorios() {
    console.log(`${this.nome} viu os relatórios.`);
  }
}
