"use client";

import { supabaseBrowserClient } from "@utils/supabase/client";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function BBCadastro({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    email: "",
    nomecompleto: "",
    relacionamento: "colaborador",
  });

  const [countClicks, setCountClicks] = useState(0);

  const handleClick = () => {
    setCountClicks(countClicks + 1);
  };

  const handleAdminModeToggle = (clicks: number) => {
    if (clicks === 7) {
      redirect("/login");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCadastro = async (data: {
    email: string;
    nomecompleto: string;
    relacionamento: string;
  }) => {
    try {
      const { error } = await supabaseBrowserClient
        .from("participantes")
        .insert([data]);

      if (error) {
        console.error("Erro ao cadastrar participante:", error.message);
        alert("Erro ao cadastrar participante.");
      } else {
        alert("Participante cadastrado com sucesso!");
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCadastro(formData);
  };

  useEffect(() => {
    handleAdminModeToggle(countClicks);
  }, [countClicks]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="cursor-pointer" onClick={() => handleClick()}>
        logo
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Cadastro de Participante
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="nomecompleto"
            className="block text-sm font-medium text-gray-700"
          >
            Nome Completo
          </label>
          <input
            type="text"
            name="nomecompleto"
            id="nomecompleto"
            value={formData.nomecompleto}
            onChange={handleChange}
            // required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="relacionamento"
            className="block text-sm font-medium text-gray-700"
          >
            Relacionamento com a Empresa
          </label>
          <select
            name="relacionamento"
            id="relacionamento"
            value={formData.relacionamento}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="colaborador">Colaborador</option>
            <option value="fornecedor">Fornecedor</option>
            <option value="parceiro">Parceiro</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
