"use client";
//Buscar forma de reducir los componentes cliente
import axios from "axios";
import { useEffect, useState } from "react";
import EditMateria from "./EditMateria";
import NavigationButtons from "./NavigationButtons";
import Loading from "@/components/Loading";
import NotFound from "@/app/not-found";

async function fetchMaterias() {
  try {
    const { data } = await axios.get(`http://localhost:3000/api/materias`);
    return data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Materia not found");
    } else {
      console.error("Error fetching materia:", error);
      throw error;
    }
  }
}

function MateriaPage({ params }) {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const loadedMaterias = await fetchMaterias();
        setMaterias(loadedMaterias);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  });

  if (loading) {
    return <Loading />;
  }
  if (params.id < 1 || params.id > materias.length) {
    return <NotFound />;
  }
  return (
    <section>
      <EditMateria paramId={params.id} materias={materias} />
      <NavigationButtons paramId={params.id} maxPages={materias.length} />
    </section>
  );
}

export default MateriaPage;
