import Produto from "../Produtos"

class Lanche extends Produto {
    constructor({ cod, nome, preco, tipo, qtd }) {
        super({ cod, nome, preco, tipo, qtd });
        this.tipo = 'lanche'; 
    }
}

export default Lanche;