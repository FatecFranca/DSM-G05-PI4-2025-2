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

const ScrollContainer = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100vh - 160px);
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const LogoImage = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 24px;
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
  margin: 20px 0;

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
  text-align: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.password || !formData.confirmPassword) {
      alert('Preencha todos os campos!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não conferem!');
      return;
    }

    setLoading(true);
    try {
      await register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.password,
        tipo: 'morador'
      });
      alert('Usuário cadastrado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      const errorMessage = error.response?.data?.err || error.response?.data?.error || error.message || 'Erro ao cadastrar usuário';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollContainer>
        <TopSection>
          <Logo>
            <LogoImage>M</LogoImage>
            <LogoText>MONIT</LogoText>
          </Logo>

          <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: '300px' }}>
            <FieldContainer>
              <Label>Nome</Label>
              <Input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleChange}
              />
            </FieldContainer>

            <FieldContainer>
              <Label>E-mail</Label>
              <Input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
              />
            </FieldContainer>

            <FieldContainer>
              <Label>Senha</Label>
              <Input
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
              />
            </FieldContainer>

            <FieldContainer>
              <Label>Confirme a Senha</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirme a Senha"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </FieldContainer>

            <Button type="submit" disabled={loading}>
              <ButtonText>{loading ? 'Cadastrando...' : 'Cadastrar'}</ButtonText>
            </Button>
          </form>
        </TopSection>

        <StyledLink to="/login">
          Já tem uma conta? Faça Login.
        </StyledLink>
      </ScrollContainer>
    </Container>
  );
};

export default Register;