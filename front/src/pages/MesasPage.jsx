// src/pages/MesasPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Empty, Modal, Select, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMesas } from '../context/MesasContext.jsx';
import { fetchMesasAbertas, fetchMesasFechadas } from '../services/mesaService';
import { useProdutos } from '../context/ProdutosContext.jsx';

const { Option } = Select;

const MesasPage = () => {
  const { abrirMesa, adicionarProduto, fecharMesa } = useMesas();
  const [mesasAbertas, setMesasAbertas] = useState([]);
  const [mesasFechadas, setMesasFechadas] = useState([]);
  // Carregar mesas abertas e fechadas ao montar
  useEffect(() => {
    const carregar = async () => {
      const abertas = await fetchMesasAbertas();
      const fechadas = await fetchMesasFechadas();
      setMesasAbertas(abertas);
      setMesasFechadas(fechadas);
    };
    carregar();
  }, []);
  const { produtos } = useProdutos();
  const [modalVisible, setModalVisible] = useState(false);
  const [mesaSelecionada, setMesaSelecionada] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState({ produtoId: '', qtd: 1 });

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const handleAdicionarProduto = async () => {
    if (!mesaSelecionada || !produtoSelecionado.produtoId) return;
    const produto = produtos.find(p => p._id === produtoSelecionado.produtoId);
    await adicionarProduto(mesaSelecionada._id, { 
      produtoId: produto._id,
      nome: produto.nome,
      preco: produto.preco,
      qtd: produtoSelecionado.qtd
    });
    setProdutoSelecionado({ produtoId: '', qtd: 1 });
  };

  return (
    <div>
      <Card title="Mesas Abertas" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={async () => {
          const novaMesaNumero = mesasAbertas.length + mesasFechadas.length + 1;
          await abrirMesa(novaMesaNumero.toString());
          // Aguarda e atualiza as listas
          setTimeout(async () => {
            setMesasAbertas(await fetchMesasAbertas());
            setMesasFechadas(await fetchMesasFechadas());
          }, 300);
        }}>
          Nova Mesa
        </Button>
      }>
        {mesasAbertas.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {mesasAbertas.map(mesa => (
              <Card
                key={mesa._id}
                title={`Mesa ${mesa.mesa}`}
                style={{ width: 200, cursor: 'pointer' }}
                actions={[
                  <EditOutlined key="edit" onClick={() => {
                    setMesaSelecionada(mesa);
                    setModalVisible(true);
                  }} />,
                  <DeleteOutlined key="delete" onClick={async () => {
                    await fecharMesa(mesa._id);
                    setMesasAbertas(await fetchMesasAbertas());
                    setMesasFechadas(await fetchMesasFechadas());
                  }} />
                ]}
              >
                <div>Total: {formatarMoeda(mesa.valorTotal)}</div>
                <div>Status: {mesa.status}</div>
              </Card>
            ))}
          </div>
        ) : <Empty description="Nenhuma mesa aberta" />}
      </Card>

      <Card title="Mesas Fechadas" style={{ marginTop: 24 }}>
        {mesasFechadas.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {mesasFechadas.map(mesa => (
              <Card
                key={mesa._id}
                title={`Mesa ${mesa.mesa}`}
                style={{ width: 200 }}
              >
                <div>Total: {formatarMoeda(mesa.valorTotal)}</div>
                <div>Status: {mesa.status}</div>
              </Card>
            ))}
          </div>
        ) : <Empty description="Nenhuma mesa fechada" />}
      </Card>

      <Modal
        title={`Mesa ${mesaSelecionada?.mesa}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {/* Lista de produtos já adicionados */}
        {mesaSelecionada?.produtos?.length > 0 ? (
          <div style={{ marginBottom: 16 }}>
            <b>Produtos da Mesa:</b>
            <ul style={{ paddingLeft: 20 }}>
              {mesaSelecionada.produtos.map((prod, idx) => (
                <li key={idx}>
                  {prod.nome} - Qtd: {prod.qtd} - Preço: {formatarMoeda(prod.preco)}
                </li>
              ))}
            </ul>
          </div>
        ) : <div style={{ marginBottom: 16 }}>Nenhum produto adicionado.</div>}

        <Select
          style={{ width: '100%', marginBottom: 10 }}
          placeholder="Selecione um produto"
          value={produtoSelecionado.produtoId}
          onChange={value => setProdutoSelecionado({ ...produtoSelecionado, produtoId: value })}
        >
          {produtos.map(prod => (
            <Option key={prod._id} value={prod._id}>{prod.nome}</Option>
          ))}
        </Select>

        <Input
          type="number"
          min={1}
          value={produtoSelecionado.qtd}
          onChange={e => setProdutoSelecionado({ ...produtoSelecionado, qtd: parseInt(e.target.value) })}
          style={{ marginBottom: 10 }}
        />

        <Button type="primary" block onClick={async () => {
          await handleAdicionarProduto();
          setMesasAbertas(await fetchMesasAbertas());
          // Atualiza mesaSelecionada para refletir os produtos novos
          const atualizada = await fetchMesasAbertas();
          const mesaAtual = atualizada.find(m => m._id === mesaSelecionada._id);
          if (mesaAtual) setMesaSelecionada(mesaAtual);
        }}>
          Adicionar Produto
        </Button>
      </Modal>
    </div>
  );
};

export default MesasPage;
