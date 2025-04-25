import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Usuarios.css';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');

  // Buscar usuários
  const buscarUsuarios = async () => {
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    const lista = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsuarios(lista);
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

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
      nome: novoNome,
      email: novoEmail
    });
    setEditandoId(null);
    buscarUsuarios();
  };

  return (
    <div className="usuarios-container">
      <h2>Usuários Cadastrados</h2>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>
                {editandoId === user.id ? (
                  <input
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                  />
                ) : (
                  user.nome
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
                        setNovoNome(user.nome);
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
