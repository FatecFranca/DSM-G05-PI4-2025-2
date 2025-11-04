// src/components/Layout.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Controle Veículos</h2>
          <p>Bem-vindo, {user?.nome}</p>
          <p className="user-type">{user?.tipo}</p>
        </div>
        
        <ul className="sidebar-menu">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/control" 
              className={location.pathname === '/control' ? 'active' : ''}
            >
              🚗 Controle
            </Link>
          </li>
          <li>
            <Link 
              to="/vehicles" 
              className={location.pathname === '/vehicles' ? 'active' : ''}
            >
              🚙 Veículos
            </Link>
          </li>
          {(user?.tipo === 'admin' || user?.tipo === 'porteiro') && (
            <li>
              <Link 
                to="/users" 
                className={location.pathname === '/users' ? 'active' : ''}
              >
                👥 Usuários
              </Link>
            </li>
          )}
        </ul>
        
        <button onClick={handleLogout} className="logout-btn">
          🚪 Sair
        </button>
      </nav>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;