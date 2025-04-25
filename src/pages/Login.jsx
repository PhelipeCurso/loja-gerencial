// src/pages/Login.jsx
import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginComGoogle = async () => {
    try {
      console.log("Iniciando login com Google...");
      const resultado = await signInWithPopup(auth, provider);
      const usuario = resultado.user;

      login({
        nome: usuario.displayName,
        email: usuario.email,
        foto: usuario.photoURL,
      });

      navigate('/');
    } catch (error) {
      console.error('Erro ao logar:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Painel Gerencial</h2>
        <button onClick={loginComGoogle} className="google-button">
          <FcGoogle size={24} />
          <span>Entrar com Google</span>
        </button>
      </div>
    </div>
  );
}
