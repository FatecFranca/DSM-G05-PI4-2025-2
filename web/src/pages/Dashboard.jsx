// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { controlService } from '../services/api';
import Loading from '../components/Loading';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    activeVehicles: 0,
    todayEntries: 0
  });
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await controlService.getAll();
      const registros = response.data;

      const today = new Date().toDateString();
      const todayEntries = registros.filter(reg => 
        new Date(reg.horaEntrada).toDateString() === today
      );
      const activeVehicles = registros.filter(reg => !reg.horaSaida);

      setStats({
        totalEntries: registros.length,
        activeVehicles: activeVehicles.length,
        todayEntries: todayEntries.length
      });

      setRecentEntries(registros.slice(-5).reverse());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <h3>Total de Entradas</h3>
          <p className="stat-number">{stats.totalEntries}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <h3>Veículos no Pátio</h3>
          <p className="stat-number">{stats.activeVehicles}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <h3>Entradas Hoje</h3>
          <p className="stat-number">{stats.todayEntries}</p>
        </div>
      </div>

      <div className="recent-entries">
        <div className="section-header">
          <h2>Entradas Recentes</h2>
          <button onClick={loadData} className="refresh-btn">
            Atualizar
          </button>
        </div>

        {recentEntries.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Tipo</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map(entry => (
                  <tr key={entry.id}>
                    <td className="placa">{entry.placa}</td>
                    <td>
                      <span className={`tipo ${entry.tipo}`}>
                        {entry.tipo}
                      </span>
                    </td>
                    <td>{formatDate(entry.horaEntrada)}</td>
                    <td>{formatDate(entry.horaSaida)}</td>
                    <td>
                      <span className={`status ${entry.horaSaida ? 'exited' : 'active'}`}>
                        {entry.horaSaida ? 'Finalizado' : 'No pátio'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <p>Nenhum registro encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;