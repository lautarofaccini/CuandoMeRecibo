import axios from "axios";
import Buttons from "./Buttons";
import FormRegulares from "@/components/FormRegulares";
import { Button } from "@nextui-org/react";

async function loadMateria(materiaId) {
  const { data } = await axios.get(
    `http://localhost:3000/api/materias/${materiaId}`
  );
  return data;
}

async function MateriaPage({ params }) {
  const materia = await loadMateria(params.id);
  return (
    <section className="flex justify-center items-center gap-x-4">
      <div className="p-6 bg-white rounded">
        <p>Numero de materia: {materia.id}</p>
        <p>Nombre de materia: {materia.asignatura}</p>
        <p>Año: {materia.nivel}</p>
        {materia.dictado ? <p>Dictado: {materia.dictado}</p> : null}
        {materia.plan ? <p>Plan: {materia.plan}</p> : null}
        <Buttons materiaId={materia.id} />
      </div>
      <div className="flex p-6 bg-slate-500 rounded">
        <FormRegulares />
        <Button className=" mt-3">Guardar</Button>
      </div>
    </section>
  );
}

export default MateriaPage;
