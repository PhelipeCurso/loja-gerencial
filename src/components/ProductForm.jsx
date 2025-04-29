import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import './ProductForm.css'; // <-- Importa o CSS

export default function CadastroProduto() {
  const [nome, setNome] = useState("");
  const [url, setUrl] = useState("");
  const [imagem, setImagem] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [genero, setGenero] = useState("");
  const [tipo, setTipo] = useState("");

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const snapshot = await getDocs(collection(db, "categorias"));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome,
        }));
        setCategorias(lista);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };
    carregarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !url || !imagem || !categoria || !genero || !tipo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await addDoc(collection(db, "produtos"), {
        nome,
        url,
        imagem,
        categoria,
        genero,
        tipo,
        criadoEm: serverTimestamp(),
      });
      alert("Produto cadastrado com sucesso!");
      setNome("");
      setUrl("");
      setImagem("");
      setCategoria("");
      setGenero("");
      setTipo("");
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="title">Cadastrar Produto</h2>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="input"
        />

        <input
          type="text"
          placeholder="URL do Produto"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input"
        />

        <input
          type="text"
          placeholder="URL da Imagem"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
          className="input"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="input"
        >
          <option value="">Selecione a Categoria</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.nome}>
              {cat.nome}
            </option>
          ))}
        </select>

        <select
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          className="input"
        >
          <option value="">Selecione o Gênero</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
          <option value="Unissex">Unissex</option>
        </select>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="input"
        >
          <option value="">Selecione o Tipo</option>
          <option value="Infantil">Infantil</option>
          <option value="Adulto">Adulto</option>
        </select>

        <button type="submit" className="btn">Cadastrar</button>
      </form>
    </div>
  );
}
