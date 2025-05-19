// src/pages/ProductList.js
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Pencil, Save, X } from 'lucide-react';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);

 useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'produtos'), (snapshot) => {
    const lista = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter((produto) =>
        produto.loja === 'Loja da Nação' || produto.loja === 'Loja de Produtos Variados'
      ); // <-- filtro aplicado aqui

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
    <div className="product-list-container">
      <h2>Produtos Cadastrados</h2>
      {products.map((product) => (
        <div key={product.id} className="product-card">
          {editingId === product.id ? (
            <>
              <input name="nome" value={editedProduct.nome} onChange={handleInputChange} placeholder="Nome" />
              <input name="imagem" value={editedProduct.imagem} onChange={handleInputChange} placeholder="Imagem" />
              <input name="url" value={editedProduct.url} onChange={handleInputChange} placeholder="URL" />
              <input name="categoria" value={editedProduct.categoria} onChange={handleInputChange} placeholder="Categoria" />
              <input name="genero" value={editedProduct.genero} onChange={handleInputChange} placeholder="Gênero" />
              <input name="tipo" value={editedProduct.tipo} onChange={handleInputChange} placeholder="Tipo" />
              <select name="loja" value={editedProduct.loja} onChange={handleInputChange}>
              <option value="">Selecione uma loja</option>
              <option value="Loja da Nação">Loja da Nação</option>
              <option value="Loja de Produtos Variados">Loja de Produtos Variados</option>
              </select>
              <input name="promocao" value={editedProduct.promocao} onChange={handleInputChange} placeholder="Promoção" />
              <input name="preco" type="number" step="0.01" value={editedProduct.preco} onChange={handleInputChange} placeholder="Preço"/>
              <input name="precoPromocao" type="number" step="0.01" value={editedProduct.precoPromocao} onChange={handleInputChange} placeholder="Preço Promocional"/>
              <div className="button-group">
                <button onClick={handleSave}>
                  <Save size={16} style={{ marginRight: 6 }} />
                  Salvar
                </button>
                <button onClick={() => setEditingId(null)} className="cancelar">
                  <X size={16} style={{ marginRight: 6 }} />
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Loja:</strong> {product.loja}</p>
              <p><strong>Nome:</strong> {product.nome}</p>
              <img src={product.imagem} alt={product.nome} width={100} />
              <p><strong>URL:</strong> {product.url}</p>
              <p><strong>Categoria:</strong> {product.categoria}</p>
              <p><strong>Gênero:</strong> {product.genero}</p>
              <p><strong>Tipo:</strong> {product.tipo}</p>
              <p><strong>Promoção:</strong> {product.promocao || 'Não'}</p>
              <p><strong>Preço:</strong> R$ {parseFloat(product.preco || 0).toFixed(2)}</p>
              <p><strong>Preço Promocional:</strong> R$ {parseFloat(product.precoPromocao || 0).toFixed(2)}</p>
              <button onClick={() => handleEditClick(product)}>
                <Pencil size={16} style={{ marginRight: 6 }} />
                Editar
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
