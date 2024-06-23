"use client";

import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

function FormEstudiantes() {
  const [estudiante, setEstudiante] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    fechaNac: "",
  });

  const form = useRef(null);
  const router = useRouter();
  const params = useParams();

  const handleChange = (e) => {
    setEstudiante({
      ...estudiante,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (params.id) {
      axios.get(`/api/estudiantes/${params.id}`).then((res) => {
        setEstudiante({
          dni: res.data.dni,
          nombre: res.data.nombre,
          apellido: res.data.apellido,
          fechaNac: res.data.fechaNac,
        });
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!params.id) {
      const res = await axios.post("/api/estudiantes", estudiante);
    } else {
      const res = await axios.put("/api/estudiantes/" + params.id, estudiante);
    }
    form.current.reset();
    router.push("/estudiantes");
    router.refresh();
  };

  const formatearFecha = (datetime) => {
    if (!datetime) return "";
    return datetime.split("T")[0];
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
        value={estudiante.dni}
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
        value={estudiante.nombre}
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
        value={estudiante.apellido}
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
        value={estudiante.fechaNac}
        className="shadow text-black appearance-none border rounded w-full py-2 px-3"
      />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
        Guardar
      </button>
    </form>
  );
}

export default FormEstudiantes;
