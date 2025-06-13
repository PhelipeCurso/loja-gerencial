import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // ajuste o caminho conforme seu projeto
import { useParams, useNavigate } from 'react-router-dom';

const EditarLoja = () => {
  const { id } = useParams(); // assume que você passa o ID pela URL tipo /editar-loja/:id
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      const lojaRef = doc(db, 'lojas', id);
      const lojaSnap = await getDoc(lojaRef);
      if (lojaSnap.exists()) {
        const dados = lojaSnap.data();
        setNome(dados.nome || '');
        setCodigo(dados.codigo || '');
      } else {
        alert('Loja não encontrada');
      }
      setLoading(false);
    };

    carregarDados();
  }, [id]);

  const salvarAlteracoes = async () => {
    if (!nome || !codigo) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      await updateDoc(doc(db, 'lojas', id), {
        nome,
        codigo
      });
      alert('Loja atualizada com sucesso!');
      navigate('/lojas'); // redireciona para a lista de lojas
    } catch (error) {
      alert('Erro ao atualizar a loja: ' + error.message);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <h2>Editar Loja</h2>
      <div>
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da Loja"
        />
      </div>
      <div>
        <label>Código:</label>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código da Loja"
        />
      </div>
      <button onClick={salvarAlteracoes} style={{ marginTop: '10px' }}>
        Salvar
      </button>
    </div>
  );
};

export default EditarLoja;
