"use client"
import axios from "axios";
import Buttons from "./Buttons";
import FormRegulares from "@/components/FormRegulares";
import { useEffect, useState } from "react";

async function fetchMateria(materiaId) {
  const { data } = await axios.get(
    `http://localhost:3000/api/materias/${materiaId}`
  );
  return data;
}

function MateriaPage({ params }) {
  const [materia, setMateria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function loadData() {
      const loadedMateria = await fetchMateria(params.id);
      setMateria(loadedMateria);
      setLoading(false);
    }

    loadData();
  }, [params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleShowForm = () => {
    setShowForm(!showForm);
  };
  


  return (
    <section className="flex justify-center items-center gap-x-4">
      <div className="p-6 bg-white rounded">
        <p>Numero de materia: {materia.id}</p>
        <p>Nombre de materia: {materia.asignatura}</p>
        <p>Año: {materia.nivel}</p>
        {materia.dictado ? <p>Dictado: {materia.dictado}</p> : null}
        {materia.plan ? <p>Plan: {materia.plan}</p> : null}
        <Buttons materiaId={materia.id} onShowForm={handleShowForm}/>
      </div>
      {showForm && (
        <div className="p-6 bg-slate-500 rounded">
          <FormRegulares condicion="regularizada" idPadre={materia.id} />
          <FormRegulares condicion="aprobada" idPadre={materia.id} />
        </div>
      )}
    </section>
  );
}

export default MateriaPage;
