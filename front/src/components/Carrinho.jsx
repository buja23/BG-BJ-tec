import React, { useState } from 'react';
import { useCarrinho } from '../context/CarrinhoContext';
import { Modal, Select, Button, Space } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './Carrinho.css';

const { Option } = Select;

const Carrinho = ({ usuarioId }) => {
  const { carrinho, removerProduto, limparCarrinho, finalizarVenda } = useCarrinho();
  const [modalVisible, setModalVisible] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');

  const handleRemover = (produtoId) => {
    removerProduto(produtoId);
  };

  const handleFinalizarVenda = async () => {
    const sucesso = await finalizarVenda(formaPagamento);
    if (sucesso) {
      setModalVisible(false);
    }
  };

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);

  return (
    <>
      <div className="carrinho-container">
        <h2><ShoppingCartOutlined /> Carrinho de Compras</h2>
        {carrinho.length === 0 && <p>Carrinho vazio</p>}
        <div className="itens-lista">
          {carrinho.map(item => (
            <div key={item._id} className="item-carrinho">
              <div className="item-info">
                <span className="item-nome">{item.nome}</span>
                <span className="item-qtd">x {item.qtd}</span>
                <span className="item-preco">R$ {(item.preco * item.qtd).toFixed(2)}</span>
              </div>
              <Button 
                type="text" 
                danger 
                onClick={() => removerProduto(item._id)}
                size="small"
              >
                Remover
              </Button>
            </div>
          ))}
        </div>
        <div className="carrinho-footer">
          <div className="total">
            <strong>Total:</strong> 
            <span>R$ {total.toFixed(2)}</span>
          </div>
          {carrinho.length > 0 && (
            <Space>
              <Button onClick={limparCarrinho} danger>
                Limpar
              </Button>
              <Button 
                type="primary" 
                onClick={() => setModalVisible(true)}
              >
                Finalizar Compra
              </Button>
            </Space>
          )}
        </div>
      </div>

      <Modal
        title="Finalizar Venda"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancelar
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleFinalizarVenda}
          >
            Confirmar Venda
          </Button>
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <h4>Resumo da Compra:</h4>
          {carrinho.map(item => (
            <div key={item._id} style={{ margin: '8px 0' }}>
              {item.nome} x {item.qtd} = R$ {(item.preco * item.qtd).toFixed(2)}
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <strong>Total: R$ {total.toFixed(2)}</strong>
          </div>
        </div>
        
        <div>
          <h4>Forma de Pagamento:</h4>
          <Select
            value={formaPagamento}
            onChange={setFormaPagamento}
            style={{ width: '100%' }}
          >
            <Option value="dinheiro">Dinheiro</Option>
            <Option value="cartao_credito">Cartão de Crédito</Option>
            <Option value="cartao_debito">Cartão de Débito</Option>
            <Option value="pix">PIX</Option>
          </Select>
        </div>
      </Modal>
    </>
  );
};

export default Carrinho;
