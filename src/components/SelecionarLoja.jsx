import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useLoja } from "../contexts/LojaContext";

export default function SelecionarLoja() {
  const { lojaSelecionada, setLojaSelecionada } = useLoja();
  const [lojas, setLojas] = useState([]);

  useEffect(() => {
    const fetchLojas = async () => {
      const snapshot = await getDocs(collection(db, "lojas"));
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLojas(lista);
    };
    fetchLojas();
  }, []);

  return (
    <div>
      <h3>Loja selecionada: {lojaSelecionada?.nome || "Nenhuma"}</h3>
      <select onChange={(e) => {
        const loja = lojas.find((l) => l.id === e.target.value);
        setLojaSelecionada(loja);
      }}>
        <option value="">-- Escolha a loja --</option>
        {lojas.map((loja) => (
          <option key={loja.id} value={loja.id}>
            {loja.nome}
          </option>
        ))}
      </select>
    </div>
  );
}
