import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CategoriaList = () => {
  const [categorias, setCategorias] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCategoria, setEditedCategoria] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categorias'), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategorias(lista);
    });

    return () => unsubscribe();
  }, []);

  const handleEditClick = (categoria) => {
    setEditingId(categoria.id);
    setEditedCategoria({ ...categoria });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCategoria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const categoriaRef = doc(db, 'categorias', editingId);
      await updateDoc(categoriaRef, {
        nome: editedCategoria.nome,
        icone: editedCategoria.icone
      });

      setEditingId(null);
      setEditedCategoria(null);
      alert('Categoria editada com sucesso!');
    } catch (error) {
      console.error('Erro ao editar:', error);
      alert('Erro ao editar a Categoria.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deleteDoc(doc(db, 'categorias', id));
        alert('Categoria excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir a Categoria.');
      }
    }
  };

  return (
    <div>
      <h2>Categorias Cadastradas</h2>
      {categorias.map((categoria) => (
        <div key={categoria.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
          {editingId === categoria.id ? (
            <>
              <input
                name="nome"
                value={editedCategoria.nome}
                onChange={handleInputChange}
                placeholder="Nome"
              />
              <input
                name="icone"
                value={editedCategoria.icone}
                onChange={handleInputChange}
                placeholder="Ícone"
              />
              <button onClick={handleSave}>Salvar</button>
              <button onClick={() => setEditingId(null)}>Cancelar</button>
            </>
          ) : (
            <>
              <p><strong>Nome:</strong> {categoria.nome}</p>
              <p><strong>Ícone:</strong> {categoria.icone}</p>
              <button onClick={() => handleEditClick(categoria)}>Editar</button>
              <button onClick={() => handleDelete(categoria.id)} style={{ marginLeft: 10, color: 'red' }}>
                Excluir
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoriaList;
