import Produto from "../Produtos"

class Porcao extends Produto {
    constructor({ cod, nome, preco, tipo, qtd }) {
        super({ cod, nome, preco, tipo, qtd });
        this.tipo = 'porcao'; 
    }
}

export default Porcao;