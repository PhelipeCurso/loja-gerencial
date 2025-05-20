// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';


const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, usuario } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h2>Painel Admin</h2>

      {usuario && (
        <div className="user-info">
          <img
            src={usuario.foto}
            alt={usuario.nome}
            className="user-avatar"
          />
          <p>{usuario.nome}</p>
        </div>
      )}

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/cadastro">Cadastro de Produtos</NavLink>
        <NavLink to="/produtos">Produtos</NavLink>
        <NavLink to="/usuarios">Usuários</NavLink>
        <NavLink to='/cadastrar-categoria'>CadastrarCategoria</NavLink>
        <NavLink to="/categoria">Categoria</NavLink>
        <NavLink to="/cadastrar-loja">Cadastrar Loja</NavLink>
        <NavLink to="/lojas">Lojas</NavLink>
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
