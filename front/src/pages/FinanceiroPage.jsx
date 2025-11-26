import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Spin, message, Typography, Button, Space } from 'antd';
import { DollarCircleOutlined, ShoppingCartOutlined, CalculatorOutlined, DownloadOutlined } from '@ant-design/icons';
import { Pie } from '@ant-design/plots';
import { fetchRelatorioFinanceiro } from '../services/financeiroService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const FinanceiroPage = () => {
    const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);

  const carregarRelatorio = async (datas) => {
    try {
      setLoading(true);
      const params = {};
      if (datas && datas.length === 2) {
        params.dataInicio = datas[0].startOf('day').toISOString();
        params.dataFim = datas[1].endOf('day').toISOString();
      }
      const data = await fetchRelatorioFinanceiro(params);
      setRelatorio(data);
    } catch (error) {
      message.error('Erro ao carregar relatório financeiro.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRelatorio(dates);
  }, [dates]);

  const pieConfig = {
    appendPadding: 10,
    data: relatorio?.distribuicaoPagamento || [],
    angleField: 'valor',
    colorField: 'tipo',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  const colunasVendas = [
    { title: 'Data', dataIndex: 'createdAt', key: 'data', render: (text) => new Date(text).toLocaleDateString('pt-BR') },
    { 
      title: 'Cliente', 
      dataIndex: 'cliente', 
      key: 'cliente', 
      // Garante que o nome do cliente seja exibido corretamente, mesmo para vendas avulsas.
      render: (cliente) => cliente?.nome || 'N/A' 
    },
    { title: 'Forma de Pagamento', dataIndex: 'formaPagamento', key: 'formaPagamento' },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (val) => `R$ ${val.toFixed(2)}` },
  ];

  const handleDownload = (formato) => {
    // A URL completa para a API de download
    const url = `http://localhost:3000/api/relatorios/vendas/${formato}`;
    
    // Pega o token do localStorage para autenticação
    const storedUser = localStorage.getItem('usuario');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    // Usa fetch para fazer a requisição com o header de autorização
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.blob())
    .then(blob => {
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `relatorio_vendas.${formato}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(err => message.error('Erro ao baixar relatório.'));
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4}>Dashboard Financeiro</Title>
          </Col>
          <Col>
            <RangePicker value={dates} onChange={setDates} />
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic 
                title="Faturamento Total" 
                value={relatorio?.faturamentoTotal || 0} 
                precision={2} 
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarCircleOutlined style={{ marginRight: 8 }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic 
                title="Vendas Realizadas" 
                value={relatorio?.totalVendas || 0} 
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic 
                title="Ticket Médio" 
                value={relatorio?.ticketMedio || 0} 
                precision={2} 
                prefix={<CalculatorOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card title="Faturamento por Forma de Pagamento">
              <Pie {...pieConfig} height={250} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Vendas Recentes">
              <Table 
                title={() => (
                  <Space>
                    <Button icon={<DownloadOutlined />} onClick={() => handleDownload('csv')}>
                      Baixar CSV
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={() => handleDownload('json')}>
                      Baixar JSON
                    </Button>
                  </Space>
                )}
                dataSource={relatorio?.vendasRecentes?.map(v => ({ ...v, key: v._id }))} 
                columns={colunasVendas} 
                pagination={{ pageSize: 5 }}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default FinanceiroPage;