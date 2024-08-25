import Link from 'next/link'

function CardEstudiante({ estudiante }) {
  return (
    <Link className="bg-white rounded-lg border-gray-800 mb-3 p-4 hover:bg-gray-200 hover:cursor-pointer text-gray-800"
    href={`/estudiantes/${estudiante.id}`}>
      <h1 className="text-lg font-bold">
        {estudiante.nombre} {estudiante.apellido}
      </h1>
      <h2 className="text-lg">DNI: {estudiante.dni}</h2>
      <p>Fecha de nacimiento: {estudiante.fechaNac}</p>
    </Link>
  );
}

export default CardEstudiante;
