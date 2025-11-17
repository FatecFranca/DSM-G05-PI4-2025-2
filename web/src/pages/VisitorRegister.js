import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { visitorService } from '../services/visitors.js';
import { vehicleService } from '../services/vehicles.js';
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

const Form = styled.form`
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.montserrat.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: 30px;
  margin-bottom: 15px;
`;

const AddVehicleButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: white;
  font-family: ${({ theme }) => theme.fonts.montserrat.semibold};
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const RemoveVehicleButton = styled.button`
  background-color: #dc3545;
  border: none;
  border-radius: 8px;
  padding: 8px 15px;
  color: white;
  font-family: ${({ theme }) => theme.fonts.montserrat.regular};
  font-size: 12px;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const VehicleCard = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
`;

const VisitorRegister = () => {
  const [formData, setFormData] = useState({
    nome: '',
    documento: '',
    veiculos: []
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVehicleChange = (index, field, value) => {
    const newVeiculos = [...formData.veiculos];
    newVeiculos[index][field] = value;
    setFormData({
      ...formData,
      veiculos: newVeiculos
    });
  };

  const addVehicle = () => {
    setFormData({
      ...formData,
      veiculos: [...formData.veiculos, { modelo: '', cor: '', placa: '' }]
    });
  };

  const removeVehicle = (index) => {
    const newVeiculos = formData.veiculos.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      veiculos: newVeiculos
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome) {
      alert('Nome do visitante é obrigatório!');
      return;
    }

    // Validar veículos se houver
    if (formData.veiculos.length > 0) {
      for (let i = 0; i < formData.veiculos.length; i++) {
        const veiculo = formData.veiculos[i];
        if (!veiculo.modelo || !veiculo.cor || !veiculo.placa) {
          alert(`Preencha todos os campos do veículo ${i + 1}!`);
          return;
        }
      }
    }

    setLoading(true);
    try {
      if (!user || !user.id) {
        alert('Erro: Usuário não autenticado');
        return;
      }

      // Criar visitante primeiro
      const visitorData = {
        nome: formData.nome,
        documento: formData.documento || null,
        usuarioId: user.id
      };

      const visitante = await visitorService.create(visitorData);

      // Criar veículos se houver
      if (formData.veiculos.length > 0) {
        for (const veiculo of formData.veiculos) {
          await vehicleService.create({
            modelo: veiculo.modelo,
            cor: veiculo.cor,
            placa: veiculo.placa,
            visitanteId: visitante.id
          });
        }
      }
      
      alert('Visitante cadastrado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao cadastrar visitante:', error);
      console.error('Detalhes do erro:', error.response?.data);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.err || 
                          error.response?.data?.details ||
                          error.message || 
                          'Erro ao cadastrar visitante';
      alert(`Erro: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <BoldText>Cadastrar Visitante</BoldText>
        
        <Form onSubmit={handleSubmit}>
          <FieldContainer>
            <Label>Nome do Visitante *</Label>
            <Input
              type="text"
              name="nome"
              placeholder="Ex: João Silva"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </FieldContainer>

          <FieldContainer>
            <Label>Documento (CPF/RG) - Opcional</Label>
            <Input
              type="text"
              name="documento"
              placeholder="Ex: 123.456.789-00"
              value={formData.documento}
              onChange={handleChange}
            />
          </FieldContainer>

          <SectionTitle>Veículos do Visitante</SectionTitle>
          
          {formData.veiculos.map((veiculo, index) => (
            <VehicleCard key={index}>
              <FieldContainer>
                <Label>Modelo do Veículo *</Label>
                <Input
                  type="text"
                  placeholder="Ex: Fiat Argo"
                  value={veiculo.modelo}
                  onChange={(e) => handleVehicleChange(index, 'modelo', e.target.value)}
                  required
                />
              </FieldContainer>

              <FieldContainer>
                <Label>Cor *</Label>
                <Input
                  type="text"
                  placeholder="Ex: Branco"
                  value={veiculo.cor}
                  onChange={(e) => handleVehicleChange(index, 'cor', e.target.value)}
                  required
                />
              </FieldContainer>

              <FieldContainer>
                <Label>Placa *</Label>
                <Input
                  type="text"
                  placeholder="Ex: ABC-1234"
                  value={veiculo.placa}
                  onChange={(e) => handleVehicleChange(index, 'placa', e.target.value)}
                  required
                />
              </FieldContainer>

              <RemoveVehicleButton type="button" onClick={() => removeVehicle(index)}>
                Remover Veículo
              </RemoveVehicleButton>
            </VehicleCard>
          ))}

          <AddVehicleButton type="button" onClick={addVehicle}>
            + Adicionar Veículo
          </AddVehicleButton>

          <Button type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Visitante'}
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default VisitorRegister;

