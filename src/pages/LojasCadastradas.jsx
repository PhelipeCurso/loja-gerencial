import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./LojasCadastradas.css";

export default function LojasCadastradas() {
  const [lojas, setLojas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [novoCodigo, setNovoCodigo] = useState("");

  const carregarLojas = async () => {
    setCarregando(true);
    try {
      const snapshot = await getDocs(collection(db, "lojas"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
        codigo: doc.data().codigo,
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

  const iniciarEdicao = (loja) => {
    setEditandoId(loja.id);
    setNovoNome(loja.nome);
    setNovoCodigo(loja.codigo || "");
  };

  const salvarEdicao = async () => {
    try {
      const ref = doc(db, "lojas", editandoId);
      await updateDoc(ref, {
        nome: novoNome,
        codigo: novoCodigo,
      });
      setEditandoId(null);
      await carregarLojas(); // Atualiza lista
    } catch (erro) {
      console.error("Erro ao atualizar loja:", erro);
    }
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNovoNome("");
    setNovoCodigo("");
  };

  return (
    <div className="container-lojas">
      <h2>Lojas Cadastradas</h2>

      <div className="container-identidade">
        {carregando ? (
          <p>Carregando...</p>
        ) : lojas.length === 0 ? (
          <p>Nenhuma loja cadastrada ainda.</p>
        ) : (
          <ul>
            {lojas.map((loja) => (
              <li key={loja.id}>
                {editandoId === loja.id ? (
                  <div>
                    <label>
                      Nome:
                      <input
                        type="text"
                        value={novoNome}
                        onChange={(e) => setNovoNome(e.target.value)}
                      />
                    </label>
                    <br />
                    <label>
                      Código:
                      <input
                        type="text"
                        value={novoCodigo}
                        onChange={(e) => setNovoCodigo(e.target.value)}
                      />
                    </label>
                    <br />
                    <button onClick={salvarEdicao}>Salvar</button>
                    <button onClick={cancelarEdicao}>Cancelar</button>
                  </div>
                ) : (
                  <div>
                    <strong>ID:</strong> {loja.id} <br />
                    <strong>Código:</strong> {loja.codigo} <br />
                    <strong>Nome:</strong> {loja.nome} <br />
                    <button onClick={() => iniciarEdicao(loja)}>Editar</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <button onClick={carregarLojas}>Recarregar</button>
      </div>
    </div>
  );
}
