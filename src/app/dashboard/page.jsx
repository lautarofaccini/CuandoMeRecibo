import { getServerSession } from "next-auth/next";
import axios from "axios";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import { Button } from "@nextui-org/react";

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
      //Incheckeable esto
      throw new Error("Error")
    }
  }
}

async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const estudiante = await fetchEstudiante(session.user.id);
  return (
    <section className="h-[calc(100hv-7rem)] flex justify-center items-center">
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
        {estudiante && (
          <div>
            <p>DNI: {estudiante.dni}</p>
            <p>Fecha de nacimiento: {estudiante.fechaNac}</p>
          </div>
        )}
        <p className=" mb-3">Correo electronico: {session.user.email}</p>
        </div>
        {!estudiante && (
          <div>
            <Button className=" bg-red-500">
              TODO: Registrar datos del estudiante
            </Button>
          </div>
        )}
        <div className="flex justify-end">
          <Link
            href="./"
            className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 "
          >
            Editar
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
