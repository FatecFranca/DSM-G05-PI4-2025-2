import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAccessRecords } from '../services/access.js';
import BottomNav from '../components/common/BottomNav.js';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding-bottom: 80px;
`;

const Content = styled.div`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const BoldText = styled.h1`
  font-family: ${({ theme }) => theme.fonts.saira.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 30px;
  text-transform: uppercase;
  width: 85%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const RecordsList = styled.div`
  width: 85%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 70vh;
  overflow-y: auto;
  padding-bottom: 20px;
`;

const RecordCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
`;

const RecordLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const RecordRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const RecordReason = styled.span`
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  font-size: 16px;
  color: #606470;
  font-weight: bold;
`;

const RecordPlate = styled.span`
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  font-size: 14px;
  color: #999;
  margin-top: 3px;
`;

const RecordTime = styled.span`
  font-size: 14px;
  color: #635bff;
  font-weight: 500;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const AccessRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const accessRecords = await accessService.getAll();
        // Ordenar por data mais recente
        const sortedRecords = accessRecords.sort((a, b) => 
          new Date(b.horaEntrada) - new Date(a.horaEntrada)
        );
        setRecords(sortedRecords);
      } catch (error) {
        console.error('Erro ao buscar registros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();

    // Atualizar a cada 60 segundos
    const interval = setInterval(fetchRecords, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Ainda não saiu';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <Container>
        <Content>
          <BoldText>Entrada/Saída</BoldText>
          <Loading>Carregando registros...</Loading>
        </Content>
        <BottomNav />
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <BoldText>Entrada/Saída</BoldText>
        
        <RecordsList>
          {records.map((record) => (
            <RecordCard key={record.id}>
              <RecordLeft>
                <RecordReason>{record.motivo || 'Sem motivo informado'}</RecordReason>
                <RecordPlate>{record.placa}</RecordPlate>
              </RecordLeft>
              <RecordRight>
                <RecordTime>{formatDateTime(record.horaSaida)}</RecordTime>
              </RecordRight>
            </RecordCard>
          ))}
          
          {records.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
              Nenhum registro encontrado
            </div>
          )}
        </RecordsList>
      </Content>
      <BottomNav />
    </Container>
  );
};

export default AccessRecords;