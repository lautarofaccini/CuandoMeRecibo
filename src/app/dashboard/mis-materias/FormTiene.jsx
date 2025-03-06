import axios from "axios";
import { useEffect, useState } from "react";
import CheckboxTiene from "./CheckboxTiene";
import Loading from "@/components/Loading";

async function fetchMaterias() {
  const { data } = await axios.get("http://localhost:3000/api/materias");
  return data;
}
async function fetchAprobadas() {
  const { data } = await axios.get(
    "http://localhost:3000/api/condicion?cond=aprobada"
  );
  return data;
}
async function fetchRegularizadas() {
  const { data } = await axios.get(
    "http://localhost:3000/api/condicion?cond=regularizada"
  );
  return data;
}

function FormTiene({ regularizo, aprobo, mostrarTodo }) {
  const [materias, setMaterias] = useState([]);
  const [selectedApr, setSelectedApr] = useState(aprobo);
  const [selectedReg, setSelectedReg] = useState(regularizo);

  const [condicionesAp, setCondicionesAp] = useState([]);
  const [condicionesReg, setCondicionesReg] = useState([]);
  const [materiasCursables, setMateriasCursables] = useState([]);
  
  const [showList, setShowList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const loadedMaterias = await fetchMaterias();
        const condicionesAprobadas = await fetchAprobadas();
        const condicionesRegularizadas = await fetchRegularizadas();
        const listaMaterias = Array.from(
          new Set(
            loadedMaterias
              .filter(
                (mat) =>
                  mat.nivel === 1 ||
                  regularizo.includes(mat.id) ||
                  aprobo.includes(mat.id) ||
                  materiasCursables.includes(mat)
              )
              .map((mat) => mat.id)
          )
        ).map((id) => loadedMaterias.find((mat) => mat.id === id));

        setMaterias(loadedMaterias);
        setCondicionesAp(condicionesAprobadas);
        setCondicionesReg(condicionesRegularizadas);
        setShowList(listaMaterias);
      } catch (error) {
        console.error("Error fetching materias:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const actualizarMateriasCursables = () => {
      const cursables = materias.filter((mat) => puedeCursar(mat.id));
      setMateriasCursables(cursables);
    };

    actualizarMateriasCursables();
  }, [materias, selectedApr, selectedReg]);

  useEffect(() => {
    if (mostrarTodo) {
      setShowList(materias);
    } else {
      const listaMaterias = Array.from(
        new Set(
          materias
            .filter(
              (mat) =>
                mat.nivel === 1 ||
                regularizo.includes(mat.id) ||
                aprobo.includes(mat.id) ||
                materiasCursables.includes(mat)
            )
            .map((mat) => mat.id)
        )
      ).map((id) => materias.find((mat) => mat.id === id));
      setShowList(listaMaterias);
    }
  }, [mostrarTodo, materias, regularizo, aprobo, materiasCursables]);

  const puedeCursar = (materiaId) => {
    const condicionesAprob = condicionesAp.filter(
      (cond) => cond.idSuces === materiaId
    );
    const condicionesRegu = condicionesReg.filter(
      (cond) => cond.idSuces === materiaId
    );

    return (
      condicionesAprob.every((cond) => selectedApr.includes(cond.idAnteces)) &&
      condicionesRegu.every(
        (cond) =>
          selectedApr.includes(cond.idAnteces) ||
          selectedReg.includes(cond.idAnteces)
      )
    );
  };

  //Agrupa las materias por nivel en un arreglo
  const groupedMaterias = showList.reduce((acc, mat) => {
    const { nivel } = mat;
    if (!acc[nivel]) {
      acc[nivel] = [];
    }
    acc[nivel].push(mat);
    return acc;
  }, {});

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

  //Si viene con una materia invalida como cursada, no se va a mostrar y se eliminara en el proximo guardado
  ///TODO: Carga forzada

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
      {Object.keys(groupedMaterias).map((nivel) => (
        <div key={nivel}>
          <h2 className="font-bold text-lg mb-2">{`Año ${nivel}`}</h2>
          {groupedMaterias[nivel].map((mat) => (
            <CheckboxTiene
              key={mat.id}
              regSelected={regularizo.includes(mat.id)}
              aprSelected={aprobo.includes(mat.id)}
              materia={mat}
              onSelectionChange={handleSelectionChange}
              disabled={!puedeCursar(mat.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default FormTiene;
