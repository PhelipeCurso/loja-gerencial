import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProductForm from './pages/ProductForm';
import ProductList from './pages/ProductList';
import Home from './pages/Home';
import Dashboard from './layout/Dashboard';
import Usuarios from './pages/Usuarios';
import './App.css';



const App = () => {
  const isAuthenticated = localStorage.getItem('auth') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {isAuthenticated ? (
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="cadastro" element={<ProductForm />} />
            <Route path="produtos" element={<ProductList />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;