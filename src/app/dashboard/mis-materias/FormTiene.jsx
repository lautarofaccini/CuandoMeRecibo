import axios from "axios";
import { useEffect, useState } from "react";
import CheckboxTiene from "./CheckboxTiene";

async function fetchMaterias() {
  const { data } = await axios.get("http://localhost:3000/api/materias");
  return data;
}

function FormTiene({regularizo, aprobo}) {
  const [materias, setMaterias] = useState([]);
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
  }, []);

  if (loading) {
    return <div className="text-gray-800">Loading...</div>;
  }
  //TODO: Tiene que mostrar lista de materias en las que no tengo condicion

  //TODO: Hacer una grilla de 3 columnas y poner el map en cada una

  //TODO: Texto responsive
  return (
    <div className="text-gray-800 ">
      <div className=" grid grid-cols-3 gap-4">
        <h1 className=" font-bold text-xl mb-4 col-span-2">Materias</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-center">
            <h1 className=" font-bold text-xl mb-4">Regularizada</h1>
          </div>
          <div className="flex justify-center">
            <h1 className=" font-bold text-xl mb-4">Aprobada</h1>
          </div>
        </div>
      </div>
      {materias.map((mat) => (
        <div key={mat.id} className="content-centers grid grid-cols-3 gap-4">
          <p className="col-span-2">{mat.asignatura}</p>

          <CheckboxTiene
            regSelected={regularizo.includes(mat.id)}
            aprSelected={aprobo.includes(mat.id)}
            materia={mat}
          ></CheckboxTiene>
        </div>
      ))}
    </div>
  );
}

export default FormTiene;
