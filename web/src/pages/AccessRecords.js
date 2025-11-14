import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { accessService } from '../services/access.js';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled.div`
  padding: 40px 60px;
  max-width: 1000px;
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

const RecordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: calc(100vh - 250px);
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
    </Container>
  );
};

export default AccessRecords;