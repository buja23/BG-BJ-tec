import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Spin, message, Typography, Divider } from 'antd';
import { Bar } from '@ant-design/plots';
import dayjs from 'dayjs';
import api from '../services/api'; // Assumindo que você tem um serviço de API

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const fetchRelatorioDRE = async (params) => {
  try {
    const response = await api.get('/dre/relatorio', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar relatório DRE:', error);
    throw error;
  }
};

const DREPage = () => {
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
      const data = await fetchRelatorioDRE(params);
      setRelatorio(data);
    } catch (error) {
      message.error('Erro ao carregar relatório DRE.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRelatorio(dates);
  }, [dates]);

  const formatarMoeda = (valor) => `R$ ${valor.toFixed(2)}`;

  const barData = relatorio ? [
    { tipo: 'Receita Líquida', valor: relatorio.receitaLiquida },
    { tipo: 'Custos (CMV)', valor: relatorio.custoMercadoriaVendida },
    { tipo: 'Lucro Bruto', valor: relatorio.lucroBruto },
  ] : [];

  const barConfig = {
    data: barData,
    xField: 'valor',
    yField: 'tipo',
    seriesField: 'tipo',
    legend: { position: 'top-left' },
    barStyle: (d) => {
      if (d.tipo === 'Lucro Bruto') return { fill: d.valor >= 0 ? '#52c41a' : '#f5222d' };
      if (d.tipo === 'Custos (CMV)') return { fill: '#faad14' };
      return { fill: '#1890ff' };
    },
    label: {
      content: (data) => formatarMoeda(data.valor),
      position: 'right',
    },
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4}>DRE - Demonstrativo de Resultados</Title>
          </Col>
          <Col>
            <RangePicker value={dates} onChange={setDates} />
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Resumo do Período">
              <Statistic title="(+) Receita Bruta de Vendas" value={formatarMoeda(relatorio?.receitaBruta || 0)} />
              <Divider style={{ margin: '12px 0' }} />
              <Statistic title="(-) Deduções e Descontos" value={formatarMoeda(relatorio?.totalDescontos || 0)} valueStyle={{ color: '#cf1322' }} />
              <Divider style={{ margin: '12px 0' }} />
              <Statistic title="(=) Receita Operacional Líquida" value={formatarMoeda(relatorio?.receitaLiquida || 0)} />
              <Divider style={{ margin: '12px 0' }} />
              <Statistic title="(-) Custo da Mercadoria Vendida (CMV)" value={formatarMoeda(relatorio?.custoMercadoriaVendida || 0)} valueStyle={{ color: '#cf1322' }} />
              <Divider style={{ margin: '12px 0' }} />
              <Statistic 
                title="(=) Lucro Bruto" 
                value={formatarMoeda(relatorio?.lucroBruto || 0)} 
                valueStyle={{ color: (relatorio?.lucroBruto || 0) >= 0 ? '#3f8600' : '#cf1322', fontSize: '24px' }} 
              />
              <Divider style={{ margin: '12px 0' }} />
              <Text type="secondary">
                Este é um DRE Gerencial Simplificado. Despesas operacionais (aluguel, salários, etc.) não estão incluídas.
              </Text>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Visão Geral de Lucratividade">
              <Bar {...barConfig} height={300} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default DREPage;