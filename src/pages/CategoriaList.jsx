import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import './CategoriaList.css';
import { Pencil, Trash2, Save, X } from 'lucide-react';

const CategoriaList = () => {
  const [categorias, setCategorias] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCategoria, setEditedCategoria] = useState(null);
  const [lojas, setLojas] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categorias'), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategorias(lista);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const lojasSnapshot = await getDocs(collection(db, 'lojas'));
        const lojasList = lojasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLojas(lojasList);
      } catch (error) {
        console.error('Erro ao buscar lojas:', error);
      }
    };
    fetchLojas();
  }, []);

  const handleEditClick = (categoria) => {
    console.log('Iniciando edição da categoria:', categoria);
    setEditingId(categoria.id);
    setEditedCategoria({
      nome: categoria.nome || '',
      icone: categoria.icone || '',
      lojaId: categoria.lojaId || '',
      lojaNome: categoria.lojaNome || '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCategoria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedCategoria) return;

    try {
      const categoriaRef = doc(db, 'categorias', editingId);
      await updateDoc(categoriaRef, {
        nome: editedCategoria.nome,
        icone: editedCategoria.icone,
        lojaId: editedCategoria.lojaId,
        lojaNome: editedCategoria.lojaNome,
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
              {console.log('Renderizando formulário de edição para:', categoria)}
              <input
                name="nome"
                value={editedCategoria?.nome || ''}
                onChange={handleInputChange}
                placeholder="Nome"
                className="input"
              />
              <input
                name="icone"
                value={editedCategoria?.icone || ''}
                onChange={handleInputChange}
                placeholder="Ícone"
                className="input"
              />

              <select
                value={editedCategoria?.lojaId || ''}
                onChange={(e) => {
                  const lojaSelecionada = lojas.find((l) => l.id === e.target.value);
                  if (lojaSelecionada) {
                    setEditedCategoria((prev) => ({
                      ...prev,
                      lojaId: lojaSelecionada.id,
                      lojaNome: lojaSelecionada.nome,
                    }));
                  }
                }}
                className="input"
              >
                <option value="" disabled>
                  Selecione uma loja
                </option>
                {lojas.map((loja) => (
                  <option key={loja.id} value={loja.id}>
                    {loja.nome}
                  </option>
                ))}
              </select>

              <input
                name="lojaNome"
                value={editedCategoria?.lojaNome || ''}
                readOnly
                placeholder="Nome da Loja"
                className="input"
              />

              <div className="button-group">
                <button onClick={handleSave} className="btn save">
                  <Save size={16} /> Salvar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Deseja cancelar a edição?')) {
                      setEditingId(null);
                      setEditedCategoria(null);
                    }
                  }}
                  className="btn cancel"
                >
                  <X size={16} /> Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <p>
                <strong>Nome:</strong> {categoria.nome}
              </p>
              <p>
                <strong>Ícone:</strong> {categoria.icone}
              </p>
              <p>
                <strong>ID da Loja:</strong> {categoria.lojaId}
              </p>
              <p>
                <strong>Nome da Loja:</strong> {categoria.lojaNome}
              </p>

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
