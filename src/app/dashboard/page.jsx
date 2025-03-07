import { getServerSession } from "next-auth/next";
import axios from "axios";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import { Button } from "@heroui/react";

async function fetchEstudiante(id) {
  try {
    const { data: estudiante } = await axios.get(
      `http://localhost:3000/api/estudiantes/${id}`
    );
    return estudiante;
  } catch (error) {
    if (error.response === 404) {
      return null;
    } else {
      console.log(error);
    }
  }
}

async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const estudiante = await fetchEstudiante(session.user.id);
  return (
    <section className="h-[calc(100hv-7rem)] ">
      <div className="flex justify-center items-center">
        <div className="p-6 bg-white rounded">
          <h1 className="block text-slate-900 text-xl font-bold mb-2">
            Dashboard
          </h1>
          <div className="text-gray-800">
            {estudiante && (
              <div>
                <p>Nombre: {estudiante.nombre}</p>
                <p>Apellido: {estudiante.apellido}</p>
              </div>
            )}
            <p>Nombre de usuario: {session.user.name}</p>
            <p className=" mb-3">Correo electronico: {session.user.email}</p>
            {estudiante ? (
              <div>
                <p>Nombre: {estudiante.nombre}</p>
                <p>Apellido: {estudiante.apellido}</p>
                <p>DNI: {estudiante.dni}</p>
                <p>Fecha de nacimiento: {estudiante.fechaNac}</p>
              </div>
            ) : (
              <p>¡Completa tu perfil!</p>
            )}
          </div>
          <div className="flex justify-end">
            <Link
              href="dashboard/mis-materias"
              className=" bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 mr-2"
            >
              Mis Materias
            </Link>
            <Link
              href={"dashboard/edit/" + session.user.id}
              className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 "
            >
              {estudiante ? "Editar" : "Completar perfil"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
