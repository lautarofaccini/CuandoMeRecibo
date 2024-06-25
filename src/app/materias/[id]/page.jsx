import axios from "axios";
import Buttons from "./Buttons";

async function loadMateria(materiaId) {
  const { data } = await axios.get(
    `http://localhost:3000/api/materias/${materiaId}`
  );
  return data;
}

async function MateriaPage({ params }) {
  const materia = await loadMateria(params.id);
  return (
    <section className="flex justify-center items-center">
      <div className="p-6 bg-white rounded">
        <p>Numero de materia: {materia.id}</p>
        <p>Nombre de materia: {materia.asignatura}</p>
        <p>Año: {materia.nivel}</p>
        {materia.dictado ? <p>Dictado: {materia.dictado}</p> : null}
        {materia.plan ? <p>Plan: {materia.plan}</p> : null}
        <Buttons materiaId={materia.id} />
        
      </div>

      <div>

      </div>

    </section>
  );
}

export default MateriaPage;
