import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./LojasCadastradas.css"; // CSS simples para estilizar

export default function LojasCadastradas() {
  const [lojas, setLojas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarLojas = async () => {
    setCarregando(true);
    try {
      const snapshot = await getDocs(collection(db, "lojas"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
      }));
      setLojas(lista);
    } catch (erro) {
      console.error("Erro ao buscar lojas:", erro);
    }
    setCarregando(false);
  };

  useEffect(() => {
    carregarLojas();
  }, []);

  return (
    <div className="container-lojas">
      <h2>Lojas Cadastradas</h2>

      <div className="container-identidade">
        <h2>ID das Lojas</h2>

        {carregando ? (
          <p>Carregando...</p>
        ) : lojas.length === 0 ? (
          <p>Nenhuma loja cadastrada ainda.</p>
        ) : (
          <ul>
            {lojas.map((loja) => (
              <li key={loja.id}>
                <strong>ID:</strong> {loja.id} <br />
                <strong>Nome:</strong> {loja.nome}
              </li>
            ))}
          </ul>
        )}

        <button onClick={carregarLojas}>Recarregar</button>
      </div>
    </div>
  );
}
