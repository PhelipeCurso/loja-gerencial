import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Usuarios.css';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [busca, setBusca] = useState("");
  const [ordemAsc, setOrdemAsc] = useState(true);
  const [carregando, setCarregando] = useState(false);

  // Buscar usuários
  const buscarUsuarios = async () => {
  setCarregando(true);
  try {
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    const lista = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsuarios(lista);
  } catch (erro) {
    console.error('Erro ao buscar usuários:', erro);
  }
  setCarregando(false);
};

  useEffect(() => {
    buscarUsuarios();
  }, []);

  // Ordenação por nome
  const ordenarPorNome = () => {
    const ordenado = [...usuarios].sort((a, b) => {
      if (!a.nomeUsuario) return 1;
      if (!b.nomeUsuario) return -1;
      return ordemAsc
        ? a.nomeUsuario.localeCompare(b.nomeUsuario)
        : b.nomeUsuario.localeCompare(a.nomeUsuario);
    });
    setUsuarios(ordenado);
    setOrdemAsc(!ordemAsc);
  };

  // Filtragem por busca
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      (u.nomeUsuario && u.nomeUsuario.toLowerCase().includes(busca.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(busca.toLowerCase()))
  );

  // Excluir usuário
  const excluirUsuario = async (id) => {
    if (window.confirm('Deseja realmente excluir este usuário?')) {
      await deleteDoc(doc(db, 'usuarios', id));
      buscarUsuarios();
    }
  };

  // Salvar edição
  const salvarEdicao = async (id) => {
    await updateDoc(doc(db, 'usuarios', id), {
      nomeUsuario: novoNome,
      email: novoEmail
    });
    setEditandoId(null);
    buscarUsuarios();
  };

  return (
    <div className="usuarios-container">
      <h2>Usuários Cadastrados</h2>
       <button className="atualizar-botao" onClick={buscarUsuarios} disabled={carregando}>
    {carregando ? (
      <span className="spinner"></span>
    ) : (
      'Atualizar 🔄'
    )}
  </button>
      <input
        type="text"
        placeholder="Buscar por nome ou e-mail..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="busca-input"
      />

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>
              Nome{" "}
              <button onClick={ordenarPorNome} className="ordenar-botao">
                {ordemAsc ? '▲' : '▼'}
              </button>
            </th>
            <th>Email</th>
            <th>Data de Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((user) => (
            <tr key={user.id}>
              <td>
                {editandoId === user.id ? (
                  <input
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                  />
                ) : (
                  user.nomeUsuario
                )}
              </td>
              <td>
                {editandoId === user.id ? (
                  <input
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {user.createdAt?.toDate
                  ? new Date(user.createdAt.toDate()).toLocaleDateString('pt-BR')
                  : '-'}
              </td>
              <td>
                {editandoId === user.id ? (
                  <>
                    <button onClick={() => salvarEdicao(user.id)}>Salvar</button>
                    <button onClick={() => setEditandoId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditandoId(user.id);
                        setNovoNome(user.nomeUsuario);
                        setNovoEmail(user.email);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => excluirUsuario(user.id)}>Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
