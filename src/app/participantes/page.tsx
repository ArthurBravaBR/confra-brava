"use client";

import { supabaseBrowserClient } from "@utils/supabase/client";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  nomecompleto: string;
  email: string;
  relacionamento: string;
  status: boolean;
}

export default function Participantes() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabaseBrowserClient
      .from("participantes")
      .select("*");

    if (error) {
      setError("Erro ao carregar os usuários.");
      console.error("Erro:", error.message);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const filterUsers = (text: string) => {
    if (text.trim() === "") {
      fetchUsers();
      return;
    }

    setUsers(
      users.filter(
        (user) =>
          user.nomecompleto.toLowerCase().includes(text.toLowerCase()) ||
          user.email.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const confirmPresenca = async (userId: number) => {
    setLoading(true);

    const { error } = await supabaseBrowserClient
      .from("participantes")
      .update({ status: true })
      .eq("id", userId);

    if (error) {
      setError("Erro ao atualizar o status.");
      console.error("Erro:", error.message);
    } else {
      alert("Presença confirmada com sucesso!");
      fetchUsers();
      setSelectedUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-center mt-4">Carregando...</p>;
  }

  if (error) {
    return <p className="text-center mt-4 text-red-500">{error}</p>;
  }

  return (
    <div className="p-3 w-full">
      <input
        type="text"
        placeholder="Quem deseja encontrar?"
        className="p-2 my-3 rounded-lg bg-lightGray w-2/5 border-none text-danger"
        onChange={(e) => filterUsers(e.target.value)}
      />

      {users.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum usuário encontrado.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Nome Completo
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Relacionamento
              </th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t cursor-pointer"
                onClick={() => setSelectedUser(user)}
              >
                <td className="px-4 py-2 text-sm text-gray-700">{user.id}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {user.nomecompleto}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {user.relacionamento}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 flex justify-center">
                  {user.status ? (
                    <IoMdCheckmarkCircleOutline
                      className="text-success"
                      size={24}
                    />
                  ) : (
                    <RxCrossCircled className="text-danger" size={24} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Confirmar Presença</h2>
            <p>
              <strong>Nome:</strong> {selectedUser.nomecompleto}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Relacionamento:</strong> {selectedUser.relacionamento}
            </p>

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                onClick={() => setSelectedUser(null)} // Fecha o modal
              >
                Cancelar
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={() => confirmPresenca(selectedUser.id)} // Confirma a presença
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
