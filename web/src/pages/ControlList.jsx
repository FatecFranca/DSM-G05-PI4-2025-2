// src/pages/ControlList.jsx
import React, { useState, useEffect } from 'react';
import { controlService } from '../services/api';
import '../styles/ControlList.css';

const ControlList = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    placa: '',
    motivo: '',
    tipo: 'visita'
  });

  useEffect(() => {
    loadRegistros();
  }, []);

  const loadRegistros = async () => {
    try {
      const response = await controlService.getAll();
      setRegistros(response.data);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      alert('Erro ao carregar registros');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterEntry = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await controlService.registerEntry(formData);
      setFormData({ placa: '', motivo: '', tipo: 'visita' });
      await loadRegistros();
      alert('Entrada registrada com sucesso!');
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao registrar entrada');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterExit = async (id) => {
    if (!window.confirm('Registrar saída deste veículo?')) return;

    try {
      await controlService.registerExit(id);
      await loadRegistros();
      alert('Saída registrada com sucesso!');
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao registrar saída');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  return (
    <div className="control-list">
      <h1>Controle de Entrada e Saída</h1>

      <div className="entry-form">
        <h2>Registrar Entrada</h2>
        <form onSubmit={handleRegisterEntry}>
          <div className="form-row">
            <div className="form-group">
              <label>Placa:</label>
              <input
                type="text"
                name="placa"
                value={formData.placa}
                onChange={handleInputChange}
                required
                placeholder="ABC-1234"
                maxLength="8"
              />
            </div>
            
            <div className="form-group">
              <label>Tipo:</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                required
              >
                <option value="visita">Visita</option>
                <option value="entrega">Entrega</option>
                <option value="servico">Serviço</option>
                <option value="morador">Morador</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Motivo:</label>
              <input
                type="text"
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                placeholder="Visita, entrega, etc."
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Registrando...' : 'Registrar Entrada'}
            </button>
          </div>
        </form>
      </div>

      <div className="registros-list">
        <div className="section-header">
          <h2>Registros</h2>
          <button onClick={loadRegistros} className="refresh-btn">
            Atualizar
          </button>
        </div>

        {registros.length === 0 ? (
          <div className="no-data">
            <p>Nenhum registro encontrado.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Tipo</th>
                  <th>Motivo</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {registros.map(registro => (
                  <tr key={registro.id} className={registro.horaSaida ? 'exited' : 'active'}>
                    <td className="placa">{registro.placa}</td>
                    <td>
                      <span className={`tipo ${registro.tipo}`}>
                        {registro.tipo}
                      </span>
                    </td>
                    <td>{registro.motivo || '-'}</td>
                    <td>{formatDate(registro.horaEntrada)}</td>
                    <td>{formatDate(registro.horaSaida)}</td>
                    <td>
                      <span className={`status ${registro.horaSaida ? 'exited' : 'active'}`}>
                        {registro.horaSaida ? 'Finalizado' : 'No pátio'}
                      </span>
                    </td>
                    <td>
                      {!registro.horaSaida && (
                        <button 
                          onClick={() => handleRegisterExit(registro.id)}
                          className="exit-btn"
                        >
                          Registrar Saída
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlList;