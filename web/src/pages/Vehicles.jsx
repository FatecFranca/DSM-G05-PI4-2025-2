// src/pages/Vehicles.jsx
import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/api';
import '../styles/Vehicles.css';

const Vehicles = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    modelo: '',
    cor: '',
    placa: '',
    usuarioId: ''
  });

  useEffect(() => {
    loadVeiculos();
  }, []);

  const loadVeiculos = async () => {
    try {
      const response = await vehicleService.getAll();
      setVeiculos(response.data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await vehicleService.create(formData);
      setFormData({ modelo: '', cor: '', placa: '', usuarioId: '' });
      setShowForm(false);
      await loadVeiculos();
      alert('Veículo cadastrado com sucesso!');
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao cadastrar veículo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este veículo?')) return;

    try {
      await vehicleService.delete(id);
      await loadVeiculos();
      alert('Veículo excluído com sucesso!');
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao excluir veículo');
    }
  };

  return (
    <div className="vehicles">
      <div className="page-header">
        <h1>Gerenciar Veículos</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancelar' : 'Novo Veículo'}
        </button>
      </div>

      {showForm && (
        <div className="vehicle-form">
          <h2>Cadastrar Veículo</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Modelo:</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Cor:</label>
                <input
                  type="text"
                  name="cor"
                  value={formData.cor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Placa:</label>
                <input
                  type="text"
                  name="placa"
                  value={formData.placa}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>ID do Usuário:</label>
                <input
                  type="number"
                  name="usuarioId"
                  value={formData.usuarioId}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Veículo'}
            </button>
          </form>
        </div>
      )}

      <div className="vehicles-list">
        <table>
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Cor</th>
              <th>Placa</th>
              <th>Proprietário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.map(veiculo => (
              <tr key={veiculo.id}>
                <td>{veiculo.modelo}</td>
                <td>{veiculo.cor}</td>
                <td>{veiculo.placa}</td>
                <td>{veiculo.usuario.nome}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(veiculo.id)}
                    className="delete-btn"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicles;