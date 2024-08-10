import { getServerSession } from "next-auth/next";
import axios from "axios";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";

async function fetchEstudiante(email) {
  const { data: usuario } = await axios.get(
    `http://localhost:3000/api/usuarios?email=${email}`
  );
  const { data: estudiante } = await axios.get(
    `http://localhost:3000/api/estudiantes/${usuario.id}`
  );
  return estudiante;
}

async function DashboardPage() {
  const session = await getServerSession(authOptions);
//TODO: Buscar una opcion que permita devolver la id con la sesion para no tener q volver a llamar a la bd (callback maybe)
  const estudiante = await fetchEstudiante(session.user.email);
  return (
    <section className="h-[calc(100hv-7rem)] flex justify-center items-center">
      <div className="p-6 bg-white rounded">
        <h1 className="block text-slate-900 text-xl font-bold mb-2">
          Dashboard
        </h1>
        <p>Nombre: {estudiante.nombre}</p>
        <p>Apellido: {estudiante.apellido}</p>
        <p>Nombre de usuario: {session.user.name}</p>
        <p>DNI: {estudiante.dni}</p>
        <p>Fecha de nacimiento: {estudiante.fechaNac}</p>
        <p className=" mb-3">Correo electronico: {session.user.email}</p>
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
