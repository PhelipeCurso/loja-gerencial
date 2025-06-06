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
  const [loja, setLoja] = useState("");
  const [lojas, setLojas] = useState([]); // <-- Novo estado
  const [nome, setNome] = useState("");
  const [url, setUrl] = useState("");
  const [imagem, setImagem] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [genero, setGenero] = useState("");
  const [tipo, setTipo] = useState("");
  const [preco, setPreco] = useState("");
  const [precoPromocao, setPrecoPromocao] = useState("");

  useEffect(() => {
    const carregarCategoriasELojas = async () => {
      try {
        // Categorias
        const snapshotCategorias = await getDocs(collection(db, "categorias"));
        const listaCategorias = snapshotCategorias.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome,
        }));
        setCategorias(listaCategorias);

        // Lojas
        const snapshotLojas = await getDocs(collection(db, "lojas"));
        const listaLojas = snapshotLojas.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome,
        }));
        setLojas(listaLojas);
      } catch (error) {
        console.error("Erro ao carregar categorias ou lojas:", error);
      }
    };
    carregarCategoriasELojas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome.trim() || !url.trim() || !imagem.trim() || !categoria || !genero || !tipo || !loja || !preco) {
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
        preco: parseFloat(preco),
        precoPromocao: precoPromocao ? parseFloat(precoPromocao) : null,
        loja,
        criadoEm: serverTimestamp(),
      });
      alert("Produto cadastrado com sucesso!");
      setNome("");
      setUrl("");
      setImagem("");
      setCategoria("");
      setGenero("");
      setTipo("");
      setPreco("");
      setPrecoPromocao("");
      setLoja("");
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="title">Cadastrar Produto</h2>

        <select
          value={loja}
          onChange={(e) => setLoja(e.target.value)}
          className="input"
        >
          <option value="">Selecione a Loja</option>
          {lojas.map((item) => (
            <option key={item.id} value={item.nome}>
              {item.nome}
            </option>
          ))}
        </select>

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

        <input
          type="number"
          placeholder="Preço (ex: 99.90)"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="input"
          step="0.01"
        />

        <input
          type="number"
          placeholder="Preço Promocional (opcional)"
          value={precoPromocao}
          onChange={(e) => setPrecoPromocao(e.target.value)}
          className="input"
          step="0.01"
        />

        <button type="submit" className="btn">Cadastrar</button>
      </form>
    </div>
  );
}
