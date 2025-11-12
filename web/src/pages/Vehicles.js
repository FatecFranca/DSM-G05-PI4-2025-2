import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { vehicleService } from '../services/vehicles.js';
import { useAuth } from '../contexts/AuthContext.js';
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

const VehiclesList = styled.div`
  width: 85%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
`;

const VehicleCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.colors.card.shadow};
`;

const VehicleLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const VehicleRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const VehicleModel = styled.span`
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  font-size: 16px;
  color: #606470;
  font-weight: bold;
`;

const VehiclePlate = styled.span`
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  font-size: 14px;
  color: #999;
  margin-top: 3px;
`;

const VehicleOwner = styled.span`
  font-size: 14px;
  color: #444;
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

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const allVehicles = await vehicleService.getAll();
        
        // Filtrar veículos se for morador
        let filteredVehicles = allVehicles;
        if (user?.tipo === 'morador') {
          filteredVehicles = allVehicles.filter(vehicle => 
            vehicle.usuario?.id === user.id
          );
        }
        
        setVehicles(filteredVehicles);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]);

  if (loading) {
    return (
      <Container>
        <Content>
          <BoldText>Veículos</BoldText>
          <Loading>Carregando veículos...</Loading>
        </Content>
        <BottomNav />
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <BoldText>Veículos</BoldText>
        
        <VehiclesList>
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id}>
              <VehicleLeft>
                <VehicleModel>{vehicle.modelo}</VehicleModel>
                <VehiclePlate>{vehicle.placa}</VehiclePlate>
              </VehicleLeft>
              <VehicleRight>
                <VehicleOwner>{vehicle.usuario?.nome}</VehicleOwner>
              </VehicleRight>
            </VehicleCard>
          ))}
          
          {vehicles.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
              Nenhum veículo encontrado
            </div>
          )}
        </VehiclesList>
      </Content>
      <BottomNav />
    </Container>
  );
};

export default Vehicles;