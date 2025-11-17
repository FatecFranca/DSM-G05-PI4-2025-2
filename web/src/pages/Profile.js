import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import styled from 'styled-components';

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

const PageHeader = styled.div`
  margin-bottom: 40px;
`;

const BoldText = styled.h1`
  font-family: ${({ theme }) => theme.fonts.saira.bold};
  font-size: 28px;
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: uppercase;
  margin: 0;
  font-weight: 700;
  letter-spacing: 1px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MenuButton = styled.button`
  width: 100%;
  background-color: #bfc8ff;
  border: none;
  border-radius: 12px;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const ButtonText = styled.span`
  font-family: ${({ theme }) => theme.fonts.saira.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: uppercase;
`;

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRecords = () => {
    navigate('/records');
  };

  const handleVehicles = () => {
    navigate('/vehicles');
  };

  const handleRegisterVehicle = () => {
    navigate('/register-vehicle');
  };

  const handleRegisterVisitor = () => {
    navigate('/register-visitor');
  };

  return (
    <Container>
      <Content>
        <PageHeader>
          <BoldText>Olá, {user ? user.nome.split(' ')[0] : 'Usuário'}!</BoldText>
        </PageHeader>

        <ButtonsContainer>
          {user && user.tipo === 'PORTEIRO' ? (
            <>
              <MenuButton onClick={handleRecords}>
                <ButtonText>Registro de entrada e saída</ButtonText>
              </MenuButton>

              <MenuButton onClick={handleVehicles}>
                <ButtonText>Ver veículos</ButtonText>
              </MenuButton>

              <MenuButton onClick={handleRegisterVehicle}>
                <ButtonText>Registrar veículo</ButtonText>
              </MenuButton>

              <MenuButton onClick={handleRegisterVisitor}>
                <ButtonText>Cadastrar visitante</ButtonText>
              </MenuButton>
            </>
          ) : (
            <>
              <MenuButton onClick={handleVehicles}>
                <ButtonText>Meus veículos</ButtonText>
              </MenuButton>

              <MenuButton onClick={handleRegisterVehicle}>
                <ButtonText>Registrar veículo</ButtonText>
              </MenuButton>

              <MenuButton onClick={handleRegisterVisitor}>
                <ButtonText>Cadastrar visitante</ButtonText>
              </MenuButton>
            </>
          )}
        </ButtonsContainer>
      </Content>
    </Container>
  );
};

export default Profile;