import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './ProductForm.css';



export default function ProductForm() {
  const [form, setForm] = useState({
    nome: '',
    url: '',
    imagem: '',
    categoria: '',
    genero: '',
    tipo: '',
    promocao: '',
  });
  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'produtos'), {
        ...form,
        criadoEm: serverTimestamp(),
      });
      setMensagem('Produto cadastrado com sucesso!');
      setForm({
        nome: '',
        url: '',
        imagem: '',
        categoria: '',
        genero: '',
        tipo: '',
        promocao: '',
      });
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setMensagem('Erro ao cadastrar o produto.');
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastrar Produto</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
        <input name="url" placeholder="URL do produto" value={form.url} onChange={handleChange} required />
        <input name="imagem" placeholder="URL da imagem" value={form.imagem} onChange={handleChange} required />
        <input name="categoria" placeholder="Categoria" value={form.categoria} onChange={handleChange} required />
  
        <select name="genero" value={form.genero} onChange={handleChange} required>
          <option value="">Gênero</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
        </select>
  
        <select name="tipo" value={form.tipo} onChange={handleChange} required>
          <option value="">Tipo</option>
          <option value="Adulto">Adulto</option>
          <option value="Infantil">Infantil</option>
        </select>

        <select name="promocao"value={form.promocao} onChange={handleChange} required>
          <option value ="">Promoção</option>
          <option value="Sim">Promoção</option>
          <option value="Não"></option>
         </select>
  
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  );
  
}
