import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { vehicleService } from '../services/vehicles.js';
import { visitorService } from '../services/visitors.js';
import { useAuth } from '../contexts/AuthContext.js';

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

const VehiclesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 8px;
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  ${({ type }) => type === 'visitante' 
    ? 'background-color: #FFF3CD; color: #856404;' 
    : 'background-color: #D1ECF1; color: #0C5460;'}
`;

const VehicleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  color: white;
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  font-size: 12px;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  const [deleting, setDeleting] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const allVehicles = await vehicleService.getAll();
        
        let filteredVehicles = allVehicles;
        // MORADOR vê apenas seus próprios veículos E veículos de visitantes que ele cadastrou
        if (user?.tipo === 'MORADOR') {
          filteredVehicles = allVehicles.filter(vehicle => 
            vehicle.usuario?.id === user.id || 
            (vehicle.visitante !== null && (vehicle.visitante?.usuarioId === user.id || vehicle.visitante?.usuario?.id === user.id))
          );
        }
        // PORTEIRO e ADMIN veem todos os veículos
        
        setVehicles(filteredVehicles);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]);

  const canDeleteVehicle = (vehicle) => {
    // Porteiros podem deletar qualquer veículo
    if (user?.tipo === 'PORTEIRO' || user?.tipo === 'ADMIN') {
      return true;
    }
    // Usuários podem deletar apenas seus próprios veículos ou veículos de visitantes que cadastraram
    if (user?.tipo === 'MORADOR') {
      return vehicle.usuario?.id === user.id || 
             (vehicle.visitante !== null && (vehicle.visitante?.usuarioId === user.id || vehicle.visitante?.usuario?.id === user.id));
    }
    return false;
  };

  const handleDelete = async (vehicle) => {
    const isVisitanteVehicle = vehicle.visitante !== null;
    const confirmMessage = isVisitanteVehicle
      ? `Tem certeza que deseja deletar este veículo? O visitante "${vehicle.visitante.nome}" e todos os seus veículos também serão removidos.`
      : 'Tem certeza que deseja deletar este veículo?';
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setDeleting(prev => ({ ...prev, [vehicle.id]: true }));
    try {
      // Se for veículo de visitante, deletar o visitante (que vai deletar todos os veículos em cascata)
      if (isVisitanteVehicle && vehicle.visitante?.id) {
        await visitorService.delete(vehicle.visitante.id);
      } else {
        // Se for veículo de morador, deletar apenas o veículo
        await vehicleService.delete(vehicle.id);
      }
      
      // Recarregar a lista de veículos
      const allVehicles = await vehicleService.getAll();
      let filteredVehicles = allVehicles;
      if (user?.tipo === 'MORADOR') {
        filteredVehicles = allVehicles.filter(v => 
          v.usuario?.id === user.id || 
          (v.visitante !== null && (v.visitante?.usuarioId === user.id || v.visitante?.usuario?.id === user.id))
        );
      }
      setVehicles(filteredVehicles);
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      alert('Erro ao deletar veículo. Tente novamente.');
    } finally {
      setDeleting(prev => ({ ...prev, [vehicle.id]: false }));
    }
  };

  if (loading) {
    return (
      <Container>
        <Content>
          <BoldText>Veículos</BoldText>
          <Loading>Carregando veículos...</Loading>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <BoldText>Veículos</BoldText>
        
        <VehiclesList>
          {vehicles.map((vehicle) => {
            const isVisitante = vehicle.visitante !== null;
            const isMorador = vehicle.usuario !== null;
            
            return (
              <VehicleCard key={vehicle.id}>
                <VehicleLeft>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <VehicleModel>{vehicle.modelo}</VehicleModel>
                    {isVisitante && <Badge type="visitante">Visitante</Badge>}
                    {isMorador && !isVisitante && <Badge type="morador">Morador</Badge>}
                  </div>
                  <VehiclePlate>{vehicle.placa}</VehiclePlate>
                </VehicleLeft>
                <VehicleRight>
                  <VehicleInfo>
                    <VehicleOwner>
                      {isVisitante 
                        ? vehicle.visitante.nome
                        : isMorador 
                        ? vehicle.usuario.nome
                        : 'Sem proprietário'}
                    </VehicleOwner>
                    {canDeleteVehicle(vehicle) && (
                      <DeleteButton
                        onClick={() => handleDelete(vehicle)}
                        disabled={deleting[vehicle.id]}
                      >
                        {deleting[vehicle.id] ? 'Deletando...' : 'Deletar'}
                      </DeleteButton>
                    )}
                  </VehicleInfo>
                </VehicleRight>
              </VehicleCard>
            );
          })}
          
          {vehicles.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
              Nenhum veículo encontrado
            </div>
          )}
        </VehiclesList>
      </Content>
    </Container>
  );
};

export default Vehicles;