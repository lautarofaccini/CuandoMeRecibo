import axios from "axios";
import CheckboxCondicion from "./CheckboxCondicion";
import { useEffect, useState } from "react";

async function fetchMaterias() {
  const { data } = await axios.get("http://localhost:3000/api/materias");
  //TODO: Solo se deben cargar materias de años menores al de la materia en cuestion
  return data;
}

function FormCondicion({ nombreCondicion, idPadre, listaCondicion }) {
  const [materias, setMaterias] = useState([]);
  const [condicion, setCondicion] = useState(listaCondicion);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const loadedMaterias = await fetchMaterias();
        setMaterias(loadedMaterias);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching materias:", error);
        setLoading(false);
      }
    }

    loadData();
  }, [idPadre]);

  useEffect(() => {
    // Actualizar condicion cuando listaCondicion cambie
    setCondicion(listaCondicion);
  }, [listaCondicion]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form name={`form-${idPadre}-${nombreCondicion}`}>
      <h1 className="font-bold text-2xl mb-2">
        {nombreCondicion === "regularizada" ? "Regular" : "Aprobado"}
      </h1>
      <ul>
        {materias.map((materia) => (
          <li key={materia.id}>
            <CheckboxCondicion
              defaultSelected={condicion.includes(materia.id)}
              materia={materia}
            />
          </li>
        ))}
      </ul>
    </form>
  );
}

export default FormCondicion;
