import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  DatePicker,
  Space,
  message,
  Row,
  Col,
  Statistic,
  Tag,
  Typography
} from 'antd';
import { 
  ShoppingCartOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { 
  listarVendas,
  buscarVendasPorPeriodo,
  atualizarStatusVenda
} from '../services/vendaService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const VendasPage = () => {
  const [loading, setLoading] = useState(false);
  const [vendas, setVendas] = useState([]);
  const [stats, setStats] = useState({
    totalVendas: 0,
    totalFaturamento: 0,
    mediaTicket: 0
  });

  useEffect(() => {
    carregarVendas();
  }, []);

  const carregarVendas = async () => {
    try {
      setLoading(true);
      const data = await listarVendas();
      setVendas(data);
      
      // Calcula estatísticas
      if (data.length > 0) {
        const totalFaturamento = data.reduce((sum, venda) => sum + venda.total, 0);
        setStats({
          totalVendas: data.length,
          totalFaturamento,
          mediaTicket: totalFaturamento / data.length
        });
      }
    } catch (error) {
      message.error('Erro ao carregar vendas');
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizarStatus = async (vendaId, novoStatus) => {
    try {
      setLoading(true);
      await atualizarStatusVenda(vendaId, novoStatus);
      message.success('Status da venda atualizado com sucesso!');
      carregarVendas();
    } catch (error) {
      message.error('Erro ao atualizar status da venda');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodoChange = async (dates) => {
    if (!dates || !dates[0] || !dates[1]) {
      await carregarVendas();
      return;
    }

    try {
      setLoading(true);
      const startDate = dates[0].startOf('day').toISOString();
      const endDate = dates[1].endOf('day').toISOString();
      const data = await buscarVendasPorPeriodo(startDate, endDate);
      setVendas(data);
    } catch (error) {
      message.error('Erro ao buscar vendas do período');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const config = {
      'pendente': { color: 'warning', icon: <ClockCircleOutlined /> },
      'concluida': { color: 'success', icon: <CheckCircleOutlined /> },
      'cancelada': { color: 'error', icon: <CloseCircleOutlined /> }
    };
    
    const statusConfig = config[status.toLowerCase()] || config.pendente;
    
    return (
      <Tag color={statusConfig.color} icon={statusConfig.icon}>
        {status.toUpperCase()}
      </Tag>
    );
  };

  const handleVerDetalhes = (record) => {
    Modal.info({
      title: `Detalhes da Venda #${record._id}`,
      width: 600,
      content: (
        <div>
          <p><strong>Data:</strong> {dayjs(record.data).format('DD/MM/YYYY HH:mm')}</p>
          <p><strong>Cliente:</strong> {record.cliente.nome}</p>
          <p><strong>Forma de Pagamento:</strong> {record.formaPagamento.replace('_', ' ').toUpperCase()}</p>
          <p><strong>Total:</strong> R$ {record.total.toFixed(2)}</p>
          <div style={{ marginTop: 16 }}>
            <h4>Produtos:</h4>
            <Table
              dataSource={record.produtos}
              columns={[
                { title: 'Nome', dataIndex: 'nome' },
                { title: 'Quantidade', dataIndex: 'quantidade' },
                { 
                  title: 'Preço', 
                  dataIndex: 'preco',
                  render: (preco) => `R$ ${preco.toFixed(2)}`
                },
                { 
                  title: 'Subtotal', 
                  render: (_, record) => `R$ ${(record.preco * record.quantidade).toFixed(2)}`
                }
              ]}
              pagination={false}
            />
          </div>
        </div>
      )
    });
  };

  const columns = [
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      render: (data) => dayjs(data).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.data) - new Date(b.data)
    },
    {
      title: 'Cliente',
      dataIndex: ['cliente', 'nome'],
      key: 'cliente',
      sorter: (a, b) => a.cliente.nome.localeCompare(b.cliente.nome)
    },
    {
      title: 'Produtos',
      dataIndex: 'produtos',
      key: 'produtos',
      render: (produtos) => (
        <Button type="link" onClick={() => message.info(`${produtos.map(p => `${p.quantidade}x ${p.nome}`).join(', ')}`)}>
          {produtos.length} itens
        </Button>
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <span style={{ color: '#52c41a' }}>R$ {total.toFixed(2)}</span>,
      sorter: (a, b) => a.total - b.total
    },
    {
      title: 'Forma de Pagamento',
      dataIndex: 'formaPagamento',
      key: 'formaPagamento',
      render: (pagamento) => pagamento.replace('_', ' ').toUpperCase(),
      filters: [
        { text: 'Dinheiro', value: 'dinheiro' },
        { text: 'Cartão', value: 'cartao' },
        { text: 'Pix', value: 'pix' }
      ],
      onFilter: (value, record) => record.formaPagamento.toLowerCase() === value
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Pendente', value: 'pendente' },
        { text: 'Concluída', value: 'concluida' },
        { text: 'Cancelada', value: 'cancelada' }
      ],
      onFilter: (value, record) => record.status.toLowerCase() === value
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" onClick={() => handleVerDetalhes(record)}>
            Detalhes
          </Button>
          {record.status === 'pendente' && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleAtualizarStatus(record._id, 'concluida')}
              style={{ backgroundColor: '#52c41a' }}
            >
              Concluir
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total de Vendas"
              value={stats.totalVendas}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Faturamento Total"
              value={stats.totalFaturamento}
              precision={2}
              prefix="R$"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Ticket Médio"
              value={stats.mediaTicket}
              precision={2}
              prefix="R$"
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Histórico de Vendas"
        style={{ marginTop: 16 }}
        extra={
          <Space>
            <RangePicker onChange={handlePeriodoChange} />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={vendas}
          rowKey="_id"
          loading={loading}
          locale={{
            emptyText: 'Nenhuma venda encontrada'
          }}
          pagination={{
            total: vendas.length,
            pageSize: 10,
            showTotal: (total) => `Total de ${total} vendas`
          }}
        />
      </Card>
    </div>
  );
};

export default VendasPage;