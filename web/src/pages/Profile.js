import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import styled from 'styled-components';
import { IoLogOutOutline } from 'react-icons/io5';
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

const Header = styled.div`
  width: 85%;
  max-width: 600px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BoldText = styled.h1`
  font-family: ${({ theme }) => theme.fonts.saira.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: uppercase;
  margin: 0;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ButtonsContainer = styled.div`
  width: 85%;
  max-width: 600px;
  margin: 0 auto;
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRecords = () => {
    navigate('/records');
  };

  const handleVehicles = () => {
    navigate('/vehicles');
  };

  const handleRegisterVehicle = () => {
    navigate('/register-vehicle');
  };

  return (
    <Container>
      <Content>
        <Header>
          <BoldText>Olá, {user ? user.nome.split(' ')[0] : 'Usuário'}!</BoldText>
          <LogoutButton onClick={handleLogout} title="Sair">
            <IoLogOutOutline size={28} />
          </LogoutButton>
        </Header>

        <ButtonsContainer>
          {user && user.tipo === 'porteiro' ? (
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
            </>
          ) : (
            <>
              <MenuButton onClick={handleVehicles}>
                <ButtonText>Meus veículos</ButtonText>
              </MenuButton>

              <MenuButton onClick={handleRegisterVehicle}>
                <ButtonText>Registrar veículo</ButtonText>
              </MenuButton>
            </>
          )}
        </ButtonsContainer>
      </Content>
      <BottomNav />
    </Container>
  );
};

export default Profile;