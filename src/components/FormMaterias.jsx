"use client";

import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

function FormMaterias() {
  const [materia, setMateria] = useState({
    id: 0,
    asignatura: "",
    nivel: 1,
    dictado: "",
    plan: 2023,
  });

  const form = useRef(null);
  const router = useRouter();
  const params = useParams();

  const handleChange = (e) => {
    setMateria({
      ...materia,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (params.id) {
      axios.get(`/api/materias/${params.id}`).then((res) => {
        setMateria({
          id: res.data.id,
          asignatura: res.data.asignatura,
          nivel: res.data.nivel,
          dictado: res.data.dictado ?? "",
          plan: res.data.plan ?? 0,
        });
      });
      console.log(materia);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = materia;
    if (data.dictado === "") {
      data.dictado = null;
    }
    if (data.plan === "") {
      data.plan = null;
    }
    if (data.plan) {
      data.plan = Number(data.plan);
    }
    console.log(data);
    if (!params.id) {
      const res = await axios.post("/api/materias", data);
    } else {
      const res = await axios.put("/api/materias/" + params.id, data);
    }
    form.current.reset();
    router.push("/materias");
    router.refresh();
  };

  return (
    <form
      className="bg-white shadow-md px-8 pt-6 pb-8"
      onSubmit={handleSubmit}
      ref={form}
    >
      <h1 className="block text-slate-900 text-xl font-bold mb-2">
        Nueva Materia
      </h1>
      <label
        htmlFor="id"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Numero de Materia
      </label>
      <input
        name="id"
        type="number"
        placeholder="1"
        min="0"
        onChange={handleChange}
        value={materia.id}
        className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3 mb-1"
        autoFocus
      />

      <label
        htmlFor="asignatura"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Nombre de la asignatura
      </label>
      <input
        name="asignatura"
        type="text"
        placeholder="Nombre"
        onChange={handleChange}
        value={materia.asignatura}
        className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3 mb-1"
      />

      <label
        htmlFor="nivel"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Año
      </label>
      <input
        name="nivel"
        type="number"
        placeholder="Nivel"
        onChange={handleChange}
        value={materia.nivel}
        className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3 mb-1"
      />

      <label
        htmlFor="dictado"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Dictado
      </label>
      <input
        name="dictado"
        type="text"
        placeholder="Anual / 1c / 2c / 1/2c"
        onChange={handleChange}
        value={materia.dictado}
        className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3"
      />

      <label
        htmlFor="plan"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Plan
      </label>
      <input
        name="plan"
        type="number"
        placeholder="2023"
        onChange={handleChange}
        value={materia.plan}
        className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3"
      />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
        Guardar
      </button>
    </form>
  );
}

export default FormMaterias;
