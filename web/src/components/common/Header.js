import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { IoArrowBack } from 'react-icons/io5';

const HeaderContainer = styled.header`
  display: flex;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.montserrat.bold};
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
`;

const Logo = styled.img`
  width: 30px;
  height: 30px;
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const routeTitles = {
    '/dashboard': 'Home',
    '/profile': 'Perfil',
    '/records': 'Registros',
    '/vehicles': 'Veículos',
    '/register-vehicle': 'Registro de Veículo'
  };

  const currentTitle = routeTitles[location.pathname] || 'MONIT';

  return (
    <HeaderContainer>
      <BackButton onClick={() => navigate(-1)}>
        <IoArrowBack size={24} color="#fff" />
      </BackButton>
      
      <Title>{currentTitle}</Title>
      
      <Logo src="/assets/logo.png" alt="Logo" />
    </HeaderContainer>
  );
};

export default Header;