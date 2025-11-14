import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 80px 20px;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const LogoImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const LogoText = styled.span`
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  margin-top: 10px;
`;

const FieldContainer = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.light};
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background-color: #fff;
  border: none;
  border-bottom: 2px solid #ccc;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  
  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
  
  &::placeholder {
    color: #5B5B7E;
  }
`;

const Button = styled.button`
  border-radius: 15px;
  padding: 15px 50px;
  width: 100%;
  max-width: 300px;
  border: none;
  background: ${({ theme }) => `linear-gradient(to left, ${theme.gradients.blue[0]}, ${theme.gradients.blue[1]})`};
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ButtonText = styled.span`
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  color: #fff;
  text-transform: uppercase;
  font-size: 18px;
`;

const StyledLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  color: #203D65;
  font-size: 14px;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Preencha e-mail e senha!');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'E-mail ou senha inválidos!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <TopSection>
        <Logo>
          <LogoImage src="/assets/logo.png" alt="MONIT Logo" />
          <LogoText>MONIT</LogoText>
        </Logo>

        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '300px' }}>
          <FieldContainer>
            <Label>E-mail</Label>
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FieldContainer>

          <FieldContainer>
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FieldContainer>

          <Button type="submit" disabled={loading}>
            <ButtonText>{loading ? 'Carregando...' : 'Acessar'}</ButtonText>
          </Button>
        </form>

        <StyledLink to="/register">
          Ainda não tem uma conta? Cadastre-se.
        </StyledLink>
      </TopSection>
    </Container>
  );
};

export default Login;