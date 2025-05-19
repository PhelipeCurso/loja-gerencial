import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastrarProduto() {
  const [formData, setFormData] = useState({
    nome: "",
    url: "",
    imagem: "",
    categoria: "",
    genero: "",
    tipo: "",
    preco: "",
    precoPromocional: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const produtoFormatado = {
      ...formData,
      preco: parseFloat(formData.preco),
      precoPromocional: formData.precoPromocional
        ? parseFloat(formData.precoPromocional)
        : null,
    };

    const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
    produtos.push(produtoFormatado);
    localStorage.setItem("produtos", JSON.stringify(produtos));

    alert("Produto cadastrado com sucesso!");
    navigate("/produtos");
  };

  return (
    <div style={styles.container}>
      <h2>Cadastrar Novo Produto</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="nome"
          placeholder="Nome do produto"
          value={formData.nome}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="url"
          name="url"
          placeholder="Link do produto (URL)"
          value={formData.url}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="url"
          name="imagem"
          placeholder="URL da imagem"
          value={formData.imagem}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoria (ex: Camisa, Boné)"
          value={formData.categoria}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <select
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Gênero</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
          <option value="Unissex">Unissex</option>
        </select>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Tipo</option>
          <option value="Adulto">Adulto</option>
          <option value="Infantil">Infantil</option>
        </select>
        <input
          type="number"
          name="preco"
          placeholder="Preço (R$)"
          value={formData.preco}
          onChange={handleChange}
          required
          style={styles.input}
          step="0.01"
        />
        <input
          type="number"
          name="precoPromocional"
          placeholder="Preço Promocional (R$)"
          value={formData.precoPromocional}
          onChange={handleChange}
          style={styles.input}
          step="0.01"
        />
        <button type="submit" style={styles.button}>
          Salvar Produto
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default CadastrarProduto;
