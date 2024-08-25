import Link from "next/link";

function CardMateria({ materia }) {
  return (
    <Link
      className="bg-white rounded-lg border-gray-800 mb-3 p-4 hover:bg-gray-200 hover:cursor-pointer text-gray-800"
      href={`/materias/${materia.id}`}
    >
      <h1 className="text-lg font-bold">
        Materia: {materia.asignatura}
      </h1>
      <h2 className="text-lg">
        Año: {materia.nivel}</h2>
      {materia.dictado ? (
        <p>Dictado: {materia.dictado}</p>
      ) : null}
      {materia.plan ? (
        <p>Plan: {materia.plan}</p>
      ) : null}
    </Link>
  );
}

export default CardMateria;
