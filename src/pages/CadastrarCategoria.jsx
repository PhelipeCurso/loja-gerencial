// src/pages/CadastrarCategoria.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './CadastrarCategoria.css';

export default function CadastrarCategoria() {
  const [nome, setNome] = useState('');
  const [icone, setIcone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome) {
      alert('Por favor, preencha o nome da categoria.');
      return;
    }

    try {
      await addDoc(collection(db, 'categorias'), {
        nome: nome,
        icone: icone,
      });
      alert('Categoria cadastrada com sucesso!');
      setNome('');
      setIcone('');
    } catch (error) {
      console.error('Erro ao cadastrar categoria:', error);
      alert('Erro ao cadastrar categoria.');
    }
  };

  return (
    <div className="categoria-container">
      <h2>Cadastrar Categoria</h2>
      <form onSubmit={handleSubmit} className="categoria-form">
        <input
          type="text"
          placeholder="Nome da Categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ícone (opcional)"
          value={icone}
          onChange={(e) => setIcone(e.target.value)}
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
