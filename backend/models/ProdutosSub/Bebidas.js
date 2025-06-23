import Produto from "../Produtos"

class bebida extends Produto {
    constructor({ cod, nome, preco, tipo, qtd }) {
        super({ cod, nome, preco, tipo, qtd });
        this.tipo = 'bebida'; 
    }
}

export default bebida;