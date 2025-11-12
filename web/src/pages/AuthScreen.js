import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 70px 0 80px;
`;

const Image = styled.img`
  max-width: 80%;
  height: auto;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 15px;
  padding: 15px 50px;
  width: 80%;
  max-width: 300px;
  border: none;
  background: ${({ theme }) => `linear-gradient(to bottom, ${theme.gradients.orange[0]}, ${theme.gradients.orange[1]})`};
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ButtonText = styled.span`
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  color: #fff;
  text-transform: uppercase;
  font-size: 20px;
`;

const AuthScreen = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Container>
      <Image src="/assets/carros_authScreen.png" alt="Carros" />
      <ButtonsContainer>
        <Button onClick={handleLogin}>
          <ButtonText>Login</ButtonText>
        </Button>
        <Button onClick={handleRegister}>
          <ButtonText>Cadastro</ButtonText>
        </Button>
      </ButtonsContainer>
    </Container>
  );
};

export default AuthScreen;