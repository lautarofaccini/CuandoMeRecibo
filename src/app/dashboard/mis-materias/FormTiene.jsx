import axios from "axios";
import CheckboxTiene from "./CheckboxTiene";
import { useEffect, useState } from "react";

async function fetchMaterias(nivel) {
  const { data } = await axios.get(
    "http://localhost:3000/api/materias?nivel=" + nivel
  );
  return data;
}

function FormTiene({ nombreCondicion, materia, listaCondicion }) {
  const [materias, setMaterias] = useState([]);
  const [condicion, setCondicion] = useState(listaCondicion);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadData() {
      try {
        const loadedMaterias = await fetchMaterias(materia.nivel);
        setMaterias(loadedMaterias);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching materias:", error);
        setLoading(false);
      }
    }

    loadData();
  }, [materia.id]);

  useEffect(() => {
    // Actualizar condicion cuando listaCondicion cambie
    setCondicion(listaCondicion);
  }, [listaCondicion]);

  if (loading) {
    return <div>Loading...</div>;
  }
//TODO: Tiene que mostrar lista de materias en las que no tengo condicion
  return (
    <div>
      <h1 className="font-bold text-2xl mb-4">
        {nombreCondicion === "regularizada" ? "Regular" : "Aprobado"}
      </h1>
      <ul>
        {materias
          .filter((mat) => mat.id !== materia.id)
          .map((mat) => (
            <li key={mat.id} className="flex items-center">
              <CheckboxTiene
                defaultSelected={condicion.includes(mat.id)}
                materia={mat}
                nombreCondicion={nombreCondicion}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}

export default FormTiene;
