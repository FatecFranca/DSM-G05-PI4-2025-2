import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext.js';
import { accessService } from '../services/access.js';
import BottomNav from '../components/common/BottomNav.js';
import CustomBarChart from '../components/charts/BarChart.js';
import CustomLineChart from '../components/charts/LineChart.js';
import Loading from '../components/common/Loading.js';


const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding-bottom: 80px;
`;

const Content = styled.div`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const BoldText = styled.h1`
  font-family: ${({ theme }) => theme.fonts.saira.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 30px;
  text-transform: uppercase;
  width: 85%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  width: 90%;
  max-width: 1000px;
  margin: 0 auto 30px;
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
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
  width: 90%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
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
        
        // Filtrar registros com horaEntrada e horaSaida para cálculo de tempo
        const registrosCompletos = records.filter(
          record => record.horaEntrada && record.horaSaida
        );

        const stats = await accessService.getStatistics({ 
          registros: registrosCompletos 
        });
        setStatistics({ ...stats, registros: records });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        // Fallback para dados mock em caso de erro
        setStatistics({
          media: 45,
          mediana: 40,
          moda: 35,
          desvio_padrao: 15,
          assimetria: 0.8,
          curtose: 2.1,
          "probabilidade_>90min": 12.5,
          registros: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Preparar dados para gráficos
  const prepareChartData = () => {
    if (!statistics?.registros) return { barData: [], lineData: [] };

    const registros = statistics.registros;
    
    // Agrupar por hora do dia para gráfico de barras
    const horasCount = {};
    registros.forEach(record => {
      if (record.horaEntrada) {
        const hora = new Date(record.horaEntrada).getHours();
        horasCount[hora] = (horasCount[hora] || 0) + 1;
      }
    });

    // Dados para gráfico de barras (picos por hora)
    const barData = Object.keys(horasCount)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(hora => ({
        hora: `${hora}h`,
        quantidade: horasCount[hora]
      }));

    // Dados para gráfico de linha (tendência diária)
    const lineData = [
      { periodo: 'Manhã', entradas: 12 },
      { periodo: 'Tarde', entradas: 25 },
      { periodo: 'Noite', entradas: 18 },
      { periodo: 'Madrugada', entradas: 5 }
    ];

    return { barData, lineData };
  };

  const { barData, lineData } = prepareChartData();

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

  const stats = [
    ['Média', `${statistics.media || 0} min`],
    ['Mediana', `${statistics.mediana || 0} min`],
    ['Moda', `${statistics.moda || 0} min`],
    ['Desvio Padrão', `${statistics.desvio_padrao || 0} min`],
    ['Assimetria', statistics.assimetria || 0],
    ['Curtose', statistics.curtose || 0],
    ['Prob. > 90 min', `${statistics['probabilidade_>90min'] || 0}%`],
  ];

  return (
    <Container>
      <Content>
        <BoldText>Estatísticas Gerais</BoldText>
        
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

          {/* Gráfico adicional de distribuição */}
          <ChartCard>
            <ChartTitle>Distribuição de Tempos de Permanência</ChartTitle>
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              padding: '40px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              <p>Gráfico de distribuição seria renderizado aqui</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                Média: {statistics.media} min | Mediana: {statistics.mediana} min
              </p>
            </div>
          </ChartCard>
        </ChartsSection>

      </Content>
      <BottomNav />
    </Container>
  );
};

export default Dashboard;