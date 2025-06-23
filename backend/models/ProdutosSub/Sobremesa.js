import Produto from "../Produtos"

class Sobremesa extends Produto {
    constructor({ cod, nome, preco, tipo, qtd }) {
        super({ cod, nome, preco, tipo, qtd });
        this.tipo = 'sobremesa'; 
    }
}

export default Sobremesa;