import React from 'react';
import styled from 'styled-components';

const Form = styled.form`
  width: 100%;
  max-width: 300px;
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

const LoginForm = ({ email, setEmail, password, setPassword, loading, onSubmit }) => {
  return (
    <Form onSubmit={onSubmit}>
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
    </Form>
  );
};

export default LoginForm;