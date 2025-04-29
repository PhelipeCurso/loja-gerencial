import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './CategoriaList.css';

// Ícones
import { Pencil, Trash2, Save, X } from 'lucide-react';

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
    <div className="categoria-container">
      <h2 className="categoria-title">Categorias Cadastradas</h2>
      {categorias.map((categoria) => (
        <div key={categoria.id} className="categoria-card">
          {editingId === categoria.id ? (
            <>
              <input
                name="nome"
                value={editedCategoria.nome}
                onChange={handleInputChange}
                placeholder="Nome"
                className="input"
              />
              <input
                name="icone"
                value={editedCategoria.icone}
                onChange={handleInputChange}
                placeholder="Ícone"
                className="input"
              />
              <div className="button-group">
                <button onClick={handleSave} className="btn save">
                  <Save size={16} /> Salvar
                </button>
                <button onClick={() => setEditingId(null)} className="btn cancel">
                  <X size={16} /> Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Nome:</strong> {categoria.nome}</p>
              <p><strong>Ícone:</strong> {categoria.icone}</p>
              <div className="button-group">
                <button onClick={() => handleEditClick(categoria)} className="btn edit">
                  <Pencil size={16} /> Editar
                </button>
                <button onClick={() => handleDelete(categoria.id)} className="btn delete">
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoriaList;
