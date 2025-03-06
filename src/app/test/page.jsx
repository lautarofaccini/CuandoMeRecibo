"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import FormTest from "./FormTest";

async function fetchMaterias() {
  const { data } = await axios.get("http://localhost:3000/api/materias");
  return data;
}
async function fetchRegularizadas() {
  const { data } = await axios.get(
    "http://localhost:3000/api/condicion?cond=regularizada"
  );
  return data;
}
async function fetchAprobadas() {
  const { data } = await axios.get(
    "http://localhost:3000/api/condicion?cond=aprobada"
  );
  return data;
}

function TestPage() {
  const [materias, setMaterias] = useState([]);
  const [showList, setShowList] = useState([]);
  const [regularizo, setRegularizo] = useState([]);
  const [aprobo, setAprobo] = useState([]);
  const [selectedReg, setSelectedReg] = useState(regularizo);
  const [selectedApr, setSelectedApr] = useState(aprobo);
  const [condicionesAp, setCondicionesAp] = useState([]);
  const [condicionesReg, setCondicionesReg] = useState([]);
  const [materiasCursables, setMateriasCursables] = useState([]);
  const [materiasNoCursables, setMateriasNoCursables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarTodo, setMostrarTodo] = useState(false);

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
        // Inicializar materiasNoCursables con las materias que no están en listaMaterias
        const noCursables = loadedMaterias.filter(
          (mat) => !listaMaterias.some((m) => m.id === mat.id)
        );
        setMateriasNoCursables(noCursables.map((mat) => mat.id));
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
    const actualizarLista = () => {
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
    };

    actualizarLista();
  }, [materiasCursables]);

  useEffect(() => {
    const actualizarMateriasCursables = () => {
      const cursables = materias.filter((mat) => puedeCursar(mat.id));
      const noCursables = materias.filter((mat) => !puedeCursar(mat.id));
      setMateriasCursables(cursables);
      setMateriasNoCursables(noCursables.map((mat) => mat.id));
    };

    actualizarMateriasCursables();
  }, [selectedApr, selectedReg]);

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

  const handleSelectedAprChange = (newSelectedApr) => {
    setSelectedApr(newSelectedApr);
  };

  const handleSelectedRegChange = (newSelectedReg) => {
    setSelectedReg(newSelectedReg);
  };

  //Aca hay que mandar la lista filtrada de materias a mostrar
  return (
    <>
      {/* El loading se paso aca para que solucionar el problema de los hooks */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <FormTest
            materias={materias}
            listaMaterias={showList}
            regularizo={regularizo}
            aprobo={aprobo}
            onSelectedAprChange={handleSelectedAprChange}
            onSelectedRegChange={handleSelectedRegChange}
            deshabilitar={materiasNoCursables}
          />
        </>
      )}
    </>
  );
}

export default TestPage;
