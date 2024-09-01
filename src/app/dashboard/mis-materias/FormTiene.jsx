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
  const [selectedApr, setSelectedApr] = useState(aprobo);
  const [selectedReg, setSelectedReg] = useState(regularizo);
  const [showList, setShowList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const loadedMaterias = await fetchMaterias();
        // Agrega materias de 1ro y materias que regularizo/aprobo
        const listaMaterias = Array.from(
          new Set(
            loadedMaterias
              .filter(
                (mat) =>
                  mat.nivel === 1 ||
                  regularizo.includes(mat.id) ||
                  aprobo.includes(mat.id)
              )
              .map((mat) => mat.id)
          )
        ).map((id) => loadedMaterias.find((mat) => mat.id === id));

        setMaterias(loadedMaterias);
        setShowList(listaMaterias);
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
    if (type === "regularizo") {
      if (value) {
        setSelectedReg((prev) => [...prev, id]);
        setSelectedApr((prev) => prev.filter((item) => item !== id));
      } else {
        setSelectedReg((prev) => prev.filter((item) => item !== id));
      }
    } else if (type === "aprobo") {
      if (value) {
        setSelectedApr((prev) => [...prev, id]);
        setSelectedReg((prev) => prev.filter((item) => item !== id));
      } else {
        setSelectedApr((prev) => prev.filter((item) => item !== id));
      }
    } else {
      console.error("Error en handleSelectionChange");
    }
  };
  if (loading) {
    return <Loading />;
  }

  //TODO: Solo mostrar las materias disponibles, e ir mostrando dinamicamente las materias que se desbloquean al aprobar o regularizar una
  //TODO: Un boton de entrada manual, que te muestre todas las materias sin limite
  //TODO: Pasarle al filtro un arreglo de ids que puede cursar, teniendo en cuenta las que regularizo y aprobo
  //TODO: Solo se puede agregar una materia si se tienen todas sus antecesoras

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

  /*TODO: Se tienen q mostrar:
    Materias de primero
    Materias que tiene condicion
    Materias que pueda tener condicion
    */

    //Tenemos showList, tiene las materias iniciales y todas sus sucesoras, en el componente de la lista se tiene que analizar si esa materia cumple para mostrarse, si cumple, retorna la materia, sino, retorna vacio. 
    //Cumple para mostrarse si el usuario regularizo o aprobo las materias que la materia pide regularizadas y si aprobo las materias que la materia pide como aprobada
    //Cuando una materia cumple para mostrarse, se debe agregar sus sucesores a la showList para que se analicen esos nuevos elementos
    //Cuando se rompe una condicion, se deben romper todos los enlaces mayores
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
      {showList.map((mat) => (
        <CheckboxTiene
          key={mat.id}
          regSelected={regularizo.includes(mat.id)}
          aprSelected={aprobo.includes(mat.id)}
          materia={mat}
          onSelectionChange={handleSelectionChange}
        />
      ))}
    </div>
  );
}

export default FormTiene;
