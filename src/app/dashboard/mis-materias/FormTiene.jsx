import axios from "axios";
import { useEffect, useState } from "react";
import CheckboxTiene from "./CheckboxTiene";
import Loading from "@/components/Loading";

async function fetchMaterias() {
  const { data } = await axios.get("http://localhost:3000/api/materias");
  return data;
}

function FormTiene({ regularizo, aprobo }) {
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

  // Maneja la actualización de las materias regularizadas o aprobadas
  const handleSelectionChange = (id, type, value) => {
    console.log(id, type, value)
  };

  if (loading) {
    return <Loading />;
  }

  //TODO: Solo mostrar las materias disponibles, e ir mostrando dinamicamente las materias que se desbloquean al aprobar o regularizar una
  //TODO: Un boton de entrada manual, que te muestre todas las materias sin limite
  //TODO: Pasarle al filtro un arreglo de ids que puede cursar, teniendo en cuenta las que regularizo y aprobo

  //Opciones:
  //Cargar todas las materias en un arreglo e ir mostrandola dependiendo de las materias aprobadas/regularizadas
    //Pros: 
    //Se puede cambiar a la manual rapidamente
    //Se cargan las materias una sola vez y despues se va mostrando el arreglo
    //Contras: 
    //Tarda mas la primera vez
  //Cargar solamente las materias que puede cursar
    //Pros: 
    //Solamente se dispone de los datos necesarios
    //Contras:
    //Opcion manual tiene que volver a llamar a todas las materias 
  return (
    <div className="text-gray-800 ">
      <div className=" grid grid-cols-3 gap-4">
        <h1 className=" font-bold text-xl mb-4 col-span-2">Materias</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-center">
            <h1 className=" font-bold text-xl mb-4">Regularizada</h1>
          </div>
          <div className="flex justify-center">
            <h1 className="font-bold text-xl mb-4">Aprobada</h1>
          </div>
        </div>
      </div>
      {materias
        .filter((mat) => mat.nivel <= 1)
        .map((mat) => (
          <div key={mat.id} className="content-center grid grid-cols-3 gap-4">
            <p className="col-span-2">{mat.asignatura}</p>

            <CheckboxTiene
              regSelected={regularizo.includes(mat.id)}
              aprSelected={aprobo.includes(mat.id)}
              materia={mat}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        ))}
    </div>
  );
}

export default FormTiene;
