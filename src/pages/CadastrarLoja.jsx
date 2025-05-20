import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import "../pages/CadastrarCategoria.css"; // Pode reaproveitar estilo
import "../pages/CadastrarLoja.css";
import { db } from '../firebase';



export default function CadastrarLoja() {
  const [nome, setNome] = useState("");

  const handleCadastrar = async () => {
    if (!nome.trim()) return alert("Nome é obrigatório");
    await addDoc(collection(db, "lojas"), { nome });
    alert("Loja cadastrada com sucesso!");
    setNome("");
  };

  return (
  <div className="container">
    <h2>Cadastrar Nova Loja</h2>
    <div className="form-group">
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da loja"
      />
      <button onClick={handleCadastrar}>Cadastrar</button>
    </div>
  </div>
);

}
