// App.jsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProductForm from './components/ProductForm';
import ProductList from './pages/ProductList';
import Home from './pages/Home';
import Dashboard from './layout/Dashboard';
import Usuarios from './pages/Usuarios';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CadastrarCategoria from './pages/CadastrarCategoria';
import CategoriaList from './pages/CategoriaList';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { LojaProvider } from './contexts/LojaContext';
import CadastrarLoja from './pages/CadastrarLoja';
import LojasCadastradas from "./pages/LojasCadastradas"
import EditarLoja from './pages/EditarLoja';

import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        login({
          nome: user.displayName,
          email: user.email,
          foto: user.photoURL,
        });
      }
    });

    return () => unsubscribe();
  }, [login]);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="cadastro" element={<ProductForm />} />
        <Route path="produtos" element={<ProductList />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="categoria" element={<CategoriaList />} />
        <Route path="cadastrar-categoria" element={<CadastrarCategoria />} />
        <Route path="cadastrar-loja" element={<CadastrarLoja />} />
        <Route path="/lojas" element={<LojasCadastradas />} />
        <Route path="/editar-loja/:id" element={<EditarLoja />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <LojaProvider>
        <Router>
          <AppRoutes />
        </Router>
      </LojaProvider>
    </AuthProvider>
  );
};

export default App;
