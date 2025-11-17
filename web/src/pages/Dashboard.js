import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext.js';
import { accessService } from '../services/access.js';
import CustomBarChart from '../components/charts/BarChart.js';
import CustomLineChart from '../components/charts/LineChart.js';
import Loading from '../components/common/Loading.js';


const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled.div`
  padding: 40px 60px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const BoldText = styled.h1`
  font-family: ${({ theme }) => theme.fonts.saira.bold};
  font-size: 28px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 40px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
`;

const ChartTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.montserrat.bold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 10px;
`;

const ValueText = styled.p`
  font-family: ${({ theme }) => theme.fonts.saira.bold};
  font-size: 16px;
  color: #2637a3;
  margin: 0;
`;

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 18px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
`;

const ChartsSection = styled.div`
  width: 100%;
  align-items: center;
  padding-bottom: 40px;
`;

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const records = await accessService.getAll();
        
        const registrosCompletos = records.filter(
          record => record.horaEntrada && record.horaSaida
        );

        if (registrosCompletos.length === 0) {
          console.warn('Nenhum registro completo encontrado (com entrada e saída)');
          setStatistics({
            media: 0,
            mediana: 0,
            moda: 0,
            desvio_padrao: 0,
            assimetria: 0,
            curtose: 0,
            "probabilidade_>90min": 0,
            regressao: "Dados insuficientes para regressão.",
            registros: records,
            semDados: true
          });
          setLoading(false);
          return;
        }

        const stats = await accessService.getStatistics({ 
          registros: registrosCompletos 
        });
        
        if (stats.erro) {
          console.error('Erro do backend:', stats.erro);
          setStatistics({
            media: 0,
            mediana: 0,
            moda: 0,
            desvio_padrao: 0,
            assimetria: 0,
            curtose: 0,
            "probabilidade_>90min": 0,
            regressao: "Dados insuficientes para regressão.",
            registros: records,
            erro: stats.erro
          });
        } else {
          setStatistics({ ...stats, registros: records });
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        console.error('Detalhes do erro:', error.response?.data || error.message);
        setStatistics({
          media: 0,
          mediana: 0,
          moda: 0,
          desvio_padrao: 0,
          assimetria: 0,
          curtose: 0,
          "probabilidade_>90min": 0,
          regressao: "Dados insuficientes para regressão.",
          registros: [],
          erro: error.response?.data?.erro || error.message || 'Erro ao carregar estatísticas'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const prepareChartData = () => {
    if (!statistics?.registros) return { barData: [], lineData: [], distributionData: [] };

    const registros = statistics.registros;
    
    const horasCount = {};
    registros.forEach(record => {
      if (record.horaEntrada) {
        const hora = new Date(record.horaEntrada).getHours();
        horasCount[hora] = (horasCount[hora] || 0) + 1;
      }
    });

    const barData = Object.keys(horasCount)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(hora => ({
        hora: `${hora}h`,
        quantidade: horasCount[hora]
      }));

    const lineData = [
      { periodo: 'Manhã', entradas: 12 },
      { periodo: 'Tarde', entradas: 25 },
      { periodo: 'Noite', entradas: 18 },
      { periodo: 'Madrugada', entradas: 5 }
    ];

    const registrosCompletos = registros.filter(r => r.horaEntrada && r.horaSaida);
    const tempos = registrosCompletos.map(r => {
      const entrada = new Date(r.horaEntrada);
      const saida = new Date(r.horaSaida);
      return (saida - entrada) / (1000 * 60);
    });

    const distributionData = [];
    if (tempos.length > 0) {
      const intervalos = [
        { label: '0-15 min', min: 0, max: 15 },
        { label: '15-30 min', min: 15, max: 30 },
        { label: '30-45 min', min: 30, max: 45 },
        { label: '45-60 min', min: 45, max: 60 },
        { label: '60-90 min', min: 60, max: 90 },
        { label: '90+ min', min: 90, max: Infinity }
      ];

      intervalos.forEach(intervalo => {
        const count = tempos.filter(t => t >= intervalo.min && t < intervalo.max).length;
        distributionData.push({
          intervalo: intervalo.label,
          quantidade: count,
          percentual: tempos.length > 0 ? ((count / tempos.length) * 100).toFixed(1) : 0
        });
      });
    }

    return { barData, lineData, distributionData };
  };

  const { barData, lineData, distributionData } = prepareChartData();

  if (loading) {
    return (
      <Container>
        <Content>
          <BoldText>Estatísticas Gerais</BoldText>
          <Loading />
        </Content>
      </Container>
    );
  }

  if (!statistics) {
    return (
      <Container>
        <Content>
          <BoldText>Estatísticas Gerais</BoldText>
          <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
            Erro ao carregar estatísticas
          </div>
        </Content>
      </Container>
    );
  }

  const semDados = statistics.semDados || statistics.erro || 
    (statistics.registros && statistics.registros.length === 0);

  // Função auxiliar para formatar valores numéricos
  const formatValue = (value) => {
    if (value === null || value === undefined) return '-';
    return typeof value === 'number' ? value.toFixed(2) : value;
  };

  // Função auxiliar para obter o valor da regressão
  const getRegressaoValue = () => {
    if (!statistics.regressao) return '-';
    if (typeof statistics.regressao === 'string') return '-';
    if (statistics.regressao.intercepto !== undefined) {
      return `${formatValue(statistics.regressao.intercepto)} min`;
    }
    return '-';
  };

  const stats = [
    ['Média', `${formatValue(statistics.media)} min`],
    ['Mediana', `${formatValue(statistics.mediana)} min`],
    ['Moda', `${formatValue(statistics.moda)} min`],
    ['Desvio Padrão', `${formatValue(statistics.desvio_padrao)} min`],
    ['Assimetria', formatValue(statistics.assimetria)],
    ['Curtose', formatValue(statistics.curtose)],
    ['Probabilidade > 90 min', `${formatValue(statistics['probabilidade_>90min'])}%`],
    ['Tempo médio previsto', getRegressaoValue()],
  ];

  return (
    <Container>
      <Content>
        <BoldText>Estatísticas Gerais</BoldText>
        
        {semDados && (
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffc107', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#856404', fontFamily: 'Montserrat, sans-serif' }}>
              {statistics.erro 
                ? `⚠️ Erro: ${statistics.erro}` 
                : statistics.semDados
                ? 'ℹ️ Não há registros completos (com entrada e saída) para calcular estatísticas. Registre algumas entradas e saídas primeiro.'
                : 'ℹ️ Não há dados disponíveis para exibir estatísticas.'}
            </p>
            {statistics.registros && statistics.registros.length > 0 && (
              <p style={{ margin: '10px 0 0 0', color: '#856404', fontSize: '14px', fontFamily: 'Montserrat, sans-serif' }}>
                Total de registros: {statistics.registros.length} | 
                Registros completos: {statistics.registros.filter(r => r.horaEntrada && r.horaSaida).length}
              </p>
            )}
          </div>
        )}
        
        <CardGrid>
          {stats.map(([title, value], index) => (
            <StatCard key={index}>
              <ChartTitle>{title}</ChartTitle>
              <ValueText>{value}</ValueText>
            </StatCard>
          ))}
        </CardGrid>

        <ChartsSection>
          {barData.length > 0 && (
            <ChartCard>
              <ChartTitle>Entradas por Hora do Dia</ChartTitle>
              <CustomBarChart 
                data={barData} 
                dataKey="quantidade" 
                xAxisDataKey="hora" 
                color="#4050ff" 
              />
            </ChartCard>
          )}

          <ChartCard>
            <ChartTitle>Tendência de Entradas por Período</ChartTitle>
            <CustomLineChart 
              data={lineData} 
              dataKey="entradas" 
              xAxisDataKey="periodo" 
              color="#ff8b2d" 
            />
          </ChartCard>

          {distributionData.length > 0 && (
            <ChartCard>
              <ChartTitle>Distribuição de Tempos de Permanência</ChartTitle>
              <CustomBarChart 
                data={distributionData} 
                dataKey="quantidade" 
                xAxisDataKey="intervalo" 
                color="#8b5cf6" 
              />
              <div style={{ 
                marginTop: '20px', 
                textAlign: 'center', 
                fontSize: '14px',
                color: '#666',
                fontFamily: 'Montserrat, sans-serif'
              }}>
                <p>Média: {statistics.media} min | Mediana: {statistics.mediana} min</p>
              </div>
            </ChartCard>
          )}
        </ChartsSection>

      </Content>
    </Container>
  );
};

export default Dashboard;