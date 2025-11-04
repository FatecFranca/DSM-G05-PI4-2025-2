// src/pages/Users.jsx
import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'usuario'
  });
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      alert('Erro ao carregar usuários');
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
      await userService.create(formData);
      setFormData({ nome: '', email: '', senha: '', tipo: 'usuario' });
      setShowForm(false);
      await loadUsers();
      alert('Usuário cadastrado com sucesso!');
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await userService.delete(id);
      await loadUsers();
      alert('Usuário excluído com sucesso!');
    } catch (error) {
      alert(error.response?.data?.error || 'Erro ao excluir usuário');
    }
  };

  // Only admin and porteiro can manage users
  const canManageUsers = currentUser?.tipo === 'admin' || currentUser?.tipo === 'porteiro';

  if (!canManageUsers) {
    return (
      <div className="users">
        <h1>Gerenciar Usuários</h1>
        <div className="access-denied">
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users">
      <div className="page-header">
        <h1>Gerenciar Usuários</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancelar' : 'Novo Usuário'}
        </button>
      </div>

      {showForm && (
        <div className="user-form">
          <h2>Cadastrar Usuário</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>E-mail:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Senha:</label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  required
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
                  <option value="usuario">Usuário</option>
                  <option value="porteiro">Porteiro</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
            </button>
          </form>
        </div>
      )}

      <div className="users-list">
        <h2>Usuários Cadastrados</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`user-type ${user.tipo}`}>
                    {user.tipo}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="delete-btn"
                    disabled={user.id === currentUser?.id}
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

export default Users;