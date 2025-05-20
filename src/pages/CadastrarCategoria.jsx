// src/pages/CadastrarCategoria.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './CadastrarCategoria.css';
// import { useLoja } from '../contexts/LojaContext'; // Removido, já que usaremos local
import { Pencil, Trash2, Save, X } from 'lucide-react';

export default function CadastrarCategoria() {
  const [nome, setNome] = useState('');
  const [icone, setIcone] = useState('');
  const [lojas, setLojas] = useState([]);
  const [lojaSelecionada, setLojaSelecionada] = useState(null);

  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const lojasSnapshot = await getDocs(collection(db, 'lojas'));
        const lojasList = lojasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLojas(lojasList);
      } catch (error) {
        console.error("Erro ao buscar lojas:", error);
      }
    };

    fetchLojas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !lojaSelecionada) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
     try {
    const novaCategoria = {
      nome: nome,
      lojaId: lojaSelecionada.id,
      lojaNome: lojaSelecionada.nome,      
    };
    if (lojaSelecionada.icone && lojaSelecionada.icone.trim() !== '') {
      novaCategoria.lojaIcone = lojaSelecionada.icone;
    }
    if (icone.trim() !== '') {
      novaCategoria.icone = icone;
    }

     await addDoc(collection(db, 'categorias'), novaCategoria);

    alert('Categoria cadastrada com sucesso!');
    setNome('');
    setIcone('');
    setLojaSelecionada(null);
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

        <select onChange={(e) => {
          const loja = lojas.find(l => l.id === e.target.value);
          setLojaSelecionada(loja);
        }} value={lojaSelecionada?.id || ''}>
          <option value="" disabled>Selecione uma loja</option>
          {lojas.map(loja => (
            <option key={loja.id} value={loja.id}>
              {loja.nome}
            </option>
          ))}
        </select>

        {lojaSelecionada && (
          <>
            <input
              type="text"
              placeholder="Ícone da Loja"
              value={lojaSelecionada.icone || ''}
              readOnly
            />
            <input
              type="text"
              placeholder="ID da Loja"
              value={lojaSelecionada.id}
              readOnly
            />
          </>
        )}

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}