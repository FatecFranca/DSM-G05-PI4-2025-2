import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 60px;
  max-width: 600px;
  z-index: 1;
  position: relative;
  overflow-y: auto;

  @media (max-width: 968px) {
    max-width: 100%;
    padding: 40px 40px 30px;
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 30px 30px 20px;
  }
`;

const RightSection = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 60px;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    padding: 30px 40px;
    flex: 1;
  }

  @media (max-width: 768px) {
    padding: 20px 20px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;

  @media (max-width: 968px) {
    justify-content: center;
    margin-bottom: 25px;
  }
`;

const LogoImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
`;

const LogoText = styled.h1`
  font-family: ${({ theme }) => theme.fonts.montserrat.bold};
  color: #fff;
  font-size: 38px;
  font-weight: 700;
  letter-spacing: 4px;
  margin: 0;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 28px;
    letter-spacing: 2px;
  }
`;

const WelcomeText = styled.h2`
  font-family: ${({ theme }) => theme.fonts.montserrat.bold};
  color: #fff;
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.2;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);

  @media (max-width: 968px) {
    text-align: center;
  }

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 12px;
  }
`;

const SubtitleText = styled.p`
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  color: rgba(255, 255, 255, 0.95);
  font-size: 18px;
  line-height: 1.6;
  margin: 0 0 24px 0;
  max-width: 500px;

  @media (max-width: 968px) {
    text-align: center;
    margin: 0 auto 24px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;

  @media (max-width: 968px) {
    text-align: center;
  }
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;

  @media (max-width: 968px) {
    justify-content: center;
  }

  &::before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: #fff;
    font-weight: bold;
    font-size: 13px;
    flex-shrink: 0;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 400px;

  @media (max-width: 968px) {
    max-width: 100%;
  }
`;

const Button = styled.button`
  border-radius: 12px;
  padding: 16px 40px;
  width: 100%;
  border: none;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.gradients.orange[0]}, ${theme.gradients.orange[1]})`};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 139, 45, 0.4);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 139, 45, 0.5);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const ButtonText = styled.span`
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  color: #fff;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 70vh;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.4));
  animation: float 4s ease-in-out infinite;

  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-15px) rotate(2deg);
    }
  }

  @media (max-width: 968px) {
    max-height: 350px;
  }

  @media (max-width: 768px) {
    max-height: 250px;
  }
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
      <LeftSection>
        <LogoContainer>
          <LogoImage src="/assets/logo.png" alt="MONIT Logo" />
          <LogoText>MONIT</LogoText>
        </LogoContainer>
        
        <WelcomeText>Bem-vindo</WelcomeText>
        <SubtitleText>
          Sistema completo de monitoramento e controle de acesso veicular para condomínios e empresas.
        </SubtitleText>

        <FeaturesList>
          <FeatureItem>Controle de entrada e saída de veículos</FeatureItem>
          <FeatureItem>Registro em tempo real</FeatureItem>
          <FeatureItem>Relatórios e estatísticas detalhadas</FeatureItem>
          <FeatureItem>Interface intuitiva e moderna</FeatureItem>
        </FeaturesList>

        <ButtonsContainer>
          <Button onClick={handleLogin}>
            <ButtonText>Fazer Login</ButtonText>
          </Button>
          <Button onClick={handleRegister}>
            <ButtonText>Criar Conta</ButtonText>
          </Button>
        </ButtonsContainer>
      </LeftSection>

      <RightSection>
        <ImageContainer>
          <Image src="/assets/carros_authScreen.png" alt="Ilustração de carros" />
        </ImageContainer>
      </RightSection>
    </Container>
  );
};

export default AuthScreen;