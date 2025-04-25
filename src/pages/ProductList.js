import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'produtos'), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(lista);
    });

    return () => unsubscribe();
  }, []);

  const handleEditClick = (produto) => {
    setEditingId(produto.id);
    setEditedProduct({ ...produto });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const produtoRef = doc(db, 'produtos', editingId);
      await updateDoc(produtoRef, {
        ...editedProduct
      });

      setEditingId(null);
      setEditedProduct(null);
      alert('Produto editado com sucesso!');
    } catch (error) {
      console.error('Erro ao editar:', error);
      alert('Erro ao editar o produto.');
    }
  };

  return (
    <div>
      <h2>Produtos Cadastrados</h2>
      {products.map((product) => (
        <div key={product.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
          {editingId === product.id ? (
            <>
              <input name="nome" value={editedProduct.nome} onChange={handleInputChange} placeholder="Nome" />
              <input name="imagem" value={editedProduct.imagem} onChange={handleInputChange} placeholder="Imagem" />
              <input name="url" value={editedProduct.url} onChange={handleInputChange} placeholder="URL" />
              <input name="categoria" value={editedProduct.categoria} onChange={handleInputChange} placeholder="Categoria" />
              <input name="genero" value={editedProduct.genero} onChange={handleInputChange} placeholder="Gênero" />
              <input name="tipo" value={editedProduct.tipo} onChange={handleInputChange} placeholder="Tipo" />
              <button onClick={handleSave}>Salvar</button>
            </>
          ) : (
            <>
              <p><strong>{product.nome}</strong></p>
              <img src={product.imagem} alt={product.nome} width={100} />
              <p><strong>URL:</strong> {product.url}</p>
              <p><strong>Categoria:</strong> {product.categoria}</p>
              <p><strong>Gênero:</strong> {product.genero}</p>
              <p><strong>Tipo:</strong> {product.tipo}</p>
              <button onClick={() => handleEditClick(product)}>Editar</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
