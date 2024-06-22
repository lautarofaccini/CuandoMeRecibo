"use client";

import { useRef, useState } from "react";
import axios from "axios";
import {useRouter} from 'next/navigation'

function FormEstudiantes() {
  const [estudiante, setEstudiante] = useState({
    dni: 0,
    nombre: "",
    apellido: "",
    fechaNac: null,
  });

  const form = useRef(null);
const router = useRouter()

  const handleChange = (e) => {
    setEstudiante({
      ...estudiante,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("/api/estudiantes", estudiante);
    form.current.reset();
    router.push('/estudiantes')
  };
  return (
    <form
      className="bg-white shadow-md px-8 pt-6 pb-8"
      onSubmit={handleSubmit}
      ref={form}
    >
      <h1 className="block text-gray-700 text-sm font-bold mb-2">
        Nuevo Estudiante
      </h1>
      <label
        htmlFor="dni"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        DNI
      </label>
      <input
        name="dni"
        type="text"
        placeholder="XXXXXXXX"
        onChange={handleChange}
        className="shadow text-black appearance-none border rounded w-full py-2 px-3"
        autoFocus
      />

      <label
        htmlFor="nombre"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Nombre
      </label>
      <input
        name="nombre"
        type="text"
        placeholder="Nombre"
        onChange={handleChange}
        className="shadow text-black appearance-none border rounded w-full py-2 px-3"
      />

      <label
        htmlFor="apellido"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Apellido
      </label>
      <input
        name="apellido"
        type="text"
        placeholder="Apellido"
        onChange={handleChange}
        className="shadow text-black appearance-none border rounded w-full py-2 px-3"
      />

      <label
        htmlFor="fechaNac"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Fecha de Nacimiento
      </label>
      <input
        name="fechaNac"
        type="date"
        onChange={handleChange}
        className="shadow text-black appearance-none border rounded w-full py-2 px-3"
      />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
        Guardar
      </button>
    </form>
  );
}

export default FormEstudiantes;
