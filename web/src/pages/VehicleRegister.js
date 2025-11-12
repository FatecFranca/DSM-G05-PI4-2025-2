import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { vehicleService } from '../services/vehicles.js';
import { userService } from '../services/users.js';
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

const Form = styled.form`
  width: 85%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  font-size: 16px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button`
  background: ${({ theme }) => `linear-gradient(to left, ${theme.gradients.blue[0]}, ${theme.gradients.blue[1]})`};
  border: none;
  border-radius: 15px;
  padding: 15px 30px;
  color: white;
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  font-size: 18px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-top: 20px;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingText = styled.p`
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: 20px;
`;

const VehicleRegister = () => {
  const [formData, setFormData] = useState({
    modelo: '',
    cor: '',
    placa: '',
    usuarioId: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Carregar lista de usuários se for porteiro ou admin
  useEffect(() => {
    if (user && user.tipo !== 'morador') {
      const loadUsers = async () => {
        setLoadingUsers(true);
        try {
          const usersList = await userService.getAll();
          setUsers(usersList);
        } catch (error) {
          console.error('Erro ao carregar usuários:', error);
          alert('Erro ao carregar lista de usuários');
        } finally {
          setLoadingUsers(false);
        }
      };

      loadUsers();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.modelo || !formData.cor || !formData.placa) {
      alert('Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      // Se for morador, usa o próprio ID, senão usa o selecionado
      const usuarioId = user.tipo === 'morador' ? user.id : formData.usuarioId;
      
      if (!usuarioId) {
        alert('Selecione um usuário para o veículo');
        return;
      }

      await vehicleService.create({
        ...formData,
        usuarioId: parseInt(usuarioId)
      });
      
      alert('Veículo cadastrado com sucesso!');
      navigate('/vehicles');
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao cadastrar veículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <BoldText>Registrar Veículo</BoldText>
        
        <Form onSubmit={handleSubmit}>
          <FieldContainer>
            <Label>Modelo do Veículo</Label>
            <Input
              type="text"
              name="modelo"
              placeholder="Ex: Fiat Argo"
              value={formData.modelo}
              onChange={handleChange}
              required
            />
          </FieldContainer>

          <FieldContainer>
            <Label>Cor</Label>
            <Input
              type="text"
              name="cor"
              placeholder="Ex: Branco"
              value={formData.cor}
              onChange={handleChange}
              required
            />
          </FieldContainer>

          <FieldContainer>
            <Label>Placa</Label>
            <Input
              type="text"
              name="placa"
              placeholder="Ex: ABC-1234"
              value={formData.placa}
              onChange={handleChange}
              required
            />
          </FieldContainer>

          {user.tipo !== 'morador' && (
            <FieldContainer>
              <Label>Proprietário</Label>
              <Select
                name="usuarioId"
                value={formData.usuarioId}
                onChange={handleChange}
                required
                disabled={loadingUsers}
              >
                <option value="">{loadingUsers ? 'Carregando usuários...' : 'Selecione um usuário'}</option>
                {users.map((userItem) => (
                  <option key={userItem.id} value={userItem.id}>
                    {userItem.nome} ({userItem.email})
                  </option>
                ))}
              </Select>
              {loadingUsers && <LoadingText>Carregando lista de usuários...</LoadingText>}
            </FieldContainer>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Veículo'}
          </Button>
        </Form>
      </Content>
      <BottomNav />
    </Container>
  );
};

export default VehicleRegister;