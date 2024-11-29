"use client";

import { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@utils/supabase/client";
import styles from "./sorteio.module.scss";

interface Participant {
  id: number;
  nomecompleto: string;
  email: string;
  relacionamento: string;
  status: boolean;
  sorteado: boolean;
  award?: string; // Campo do prêmio
}

interface Winner {
  participant: Participant;
  prize: string;
}

export default function Sorteio() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sorteados, setSorteados] = useState<Winner[]>([]);
  const [prize, setPrize] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [winnerMessage, setWinnerMessage] = useState<string>("");

  const fetchParticipantsAndWinners = async () => {
    setLoading(true);

    const { data: eligibleParticipants, error: participantsError } =
      await supabaseBrowserClient
        .from("participantes")
        .select("*")
        .eq("status", true)
        .is("sorted", false);

    const { data: winners, error: winnersError } = await supabaseBrowserClient
      .from("participantes")
      .select("*")
      .eq("sorted", true);
    if (participantsError || winnersError) {
      console.error(
        "Erro ao carregar dados:",
        participantsError || winnersError
      );
    } else {
      setParticipants(eligibleParticipants || []);
      setSorteados(
        winners?.map((winner) => ({
          participant: winner,
          prize: winner.award || "Prêmio não especificado",
        })) || []
      );
    }

    setLoading(false);
  };

  const [test, setTest] = useState();

  console.log(test);

  const handleSorteio = async () => {
    if (participants.length === 0) {
      alert("Nenhum participante elegível para o sorteio!");
      return;
    }

    if (!prize.trim()) {
      alert("Por favor, insira o nome do prêmio antes de sortear!");
      return;
    }

    const sorteado =
      participants[Math.floor(Math.random() * participants.length)];
    setTest(sorteado.nomecompleto);

    const { error } = await supabaseBrowserClient
      .from("participantes")
      .update({ sorted: true, award: prize })
      .eq("id", sorteado.id);

    if (error) {
      console.error("Erro ao atualizar sorteado:", error.message);
      return;
    }

    setSorteados((prev) => [...prev, { participant: sorteado, prize }]);
    setParticipants((prev) => prev.filter((p) => p.id !== sorteado.id));

    // Abrir modal com o contador
    setCountdown(5);
    setWinnerMessage(`O ganhador do ${prize} é: ${sorteado.nomecompleto}`);
    setModalVisible(true);

    // Iniciar contador
    let timeLeft = 5;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setCountdown(null); // Finalizar contador
      }
    }, 1000);

    setPrize("");
  };

  useEffect(() => {
    fetchParticipantsAndWinners();
  }, []);

  return (
    <div className="p-4 h-full flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-4">
        Sorteio de Participantes
      </h1>

      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Digite o nome do prêmio"
          value={prize}
          onChange={(e) => setPrize(e.target.value)}
          className="p-2 border border-gray-300 rounded-md flex-1"
        />
      </div>

      <div className="flex gap-8 h-full">
        <div className="w-1/2 border border-lightGray rounded-2xl overflow-y-autop py-3">
          <h2 className="text-xl font-semibold mb-2 text-center">
            Participantes Elegíveis
          </h2>
          {participants.length === 0 ? (
            <p className="text-gray-500 text-center">
              Nenhum participante elegível para sorteio.
            </p>
          ) : (
            <ul className="list-disc pl-5">
              {participants.map((p) => (
                <li key={p.id} className="mb-2">
                  <div>
                    <strong>{p.nomecompleto}</strong> ({p.email})
                  </div>
                  <span className="text-sm text-gray-500">
                    {p.relacionamento}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <button
            onClick={handleSorteio}
            disabled={loading || participants.length === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 disabled:bg-lightGray disabled:text-black"
          >
            {loading ? "Carregando..." : "Sortear"}
          </button>
        </div>

        {/* Modal */}
        {modalVisible && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full h-2/3 text-center flex justify-center items-center flex-col">
              <div className={styles.pyro}>
                <div className={styles.before}></div>
                <div className={styles.after}></div>
                {countdown !== null ? (
                  <h2 className="text-2xl font-semibold">
                    Sorteando... {countdown}s
                  </h2>
                ) : (
                  <h2 className="text-2xl font-bold text-red-600">
                    {winnerMessage}
                  </h2>
                )}
                <button
                  className="mt-20 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => setModalVisible(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="w-1/2 border border-lightGray rounded-2xl overflow-y-auto py-3">
          <h2 className="text-xl font-semibold mb-2 text-center">Sorteados</h2>
          {sorteados.length === 0 ? (
            <p className="text-gray-500 text-center">Nenhum sorteado ainda.</p>
          ) : (
            <ul className="px-6 list-none">
              {sorteados.map((s, index) => (
                <li
                  key={s.participant.id}
                  className="mb-2 bg-lightGray p-2 rounded-xl"
                >
                  <div>
                    <strong>{s.participant.nomecompleto}</strong>
                  </div>
                  <span className="text-sm text-gray-500">
                    Relacionamento: {s.participant.relacionamento}
                  </span>
                  <div className="text-sm text-green-600">
                    Prêmio: <strong>{s.prize}</strong>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
