import bebida from "./ProdutosSub/bebidas";
import Porcao from "./ProdutosSub/Porcao";
import Lanche from "./ProdutosSub/lanche";
import Sobremesa from "./ProdutosSub/Sobremesa";

class ProdutoFactory {
    static criarProduto({cod, nome, preco, tipo, qtd }){
        switch (tipo) {
            case 'bebida':
                return new bebida({ cod, nome, preco, tipo, qtd });
            case 'porcao':
                return new Porcao({ cod, nome, preco, tipo, qtd });
            case 'lanche':
                return new Lanche({ cod, nome, preco, tipo, qtd });
            case 'sobremesa':
                return new Sobremesa({ cod, nome, preco, tipo, qtd });
            default:
                throw new Error(`Tipo de produto desconhecido: ${tipo}`);
        }
    }
}

export default ProdutoFactory;