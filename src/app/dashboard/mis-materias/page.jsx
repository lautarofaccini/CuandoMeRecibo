"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import axios from "axios";
import Loading from "@/components/Loading";
import FormCondiciones from "@/components/FormCondiciones";

/* 
Codigo generado para reemplazar el codigo de arriba, no testeado aun
TODO: Testear
import axios from "axios";

async function actualizarCondiciones(nombreCondicion, condicion, data, id, tipoId = "dni") {
  async function sendUpdate(nuevoId, viejoId) {
    const payload = {
      [tipoId === "dni" ? "id" : "idAnteces"]: nuevoId,
    };
    const res = await axios.put(
      `/api/${tipoId === "dni" ? "tiene" : "condicion"}?cond=${nombreCondicion}&id=${viejoId}&${tipoId}=${id}`,
      payload
    );
    return res.data;
  }

  async function sendCreate(nuevoId) {
    const payload = {
      [tipoId === "dni" ? "id" : "idAnteces"]: nuevoId,
      [tipoId]: id,
    };
    const res = await axios.post(`/api/${tipoId === "dni" ? "tiene" : "condicion"}?cond=${nombreCondicion}`, payload);
    return res.data;
  }

  async function sendDelete(idElim) {
    const res = await axios.delete(
      `/api/${tipoId === "dni" ? "tiene" : "condicion"}?cond=${nombreCondicion}&id=${idElim}&${tipoId}=${id}`
    );
    if (res.status !== 204) {
      console.log("Error al eliminar materia: ", res);
    }
  }

  if (JSON.stringify(data) !== JSON.stringify(condicion)) {
    //! Si en algun momento se desordenan las listas, esta comparacion podria dar un falso positivo
    const dataAux = data.filter((elemento) => !condicion.includes(elemento));
    const condAux = condicion.filter((elemento) => !data.includes(elemento));
    const Iguales = condicion.filter((elemento) => data.includes(elemento));
    let salida = [];
    for (let i = 0; i < Iguales.length; i++) {
      salida.push({
        [tipoId === "dni" ? "id" : "idAnteces"]: Iguales[i],
        [tipoId]: id,
      });
    }
    if (dataAux.length !== condAux.length) {
      if (dataAux.length > condAux.length) {
        let dLenght = dataAux.length;
        for (let i = 0; i < dLenght - condAux.length; i++) {
          salida.push(sendCreate(dataAux[0]));
          dataAux.shift();
        }
      } else {
        let rLenght = condAux.length;
        for (let i = 0; i < rLenght - dataAux.length; i++) {
          sendDelete(condAux[0]);
          condAux.shift();
        }
      }
    }
    if (dataAux.length !== 0 || condAux.length !== 0) {
      // Misma longitud
      for (let i = 0; i < condAux.length; i++) {
        salida.push(sendUpdate(dataAux[0], condAux[i]));
        dataAux.shift();
      }
    }
    // Esperar a que todas las promesas se resuelvan
    salida = await Promise.all(salida);
    return salida.map((reg) => reg[tipoId === "dni" ? "id" : "idAnteces"]).sort((a, b) => a - b);
    //TODO: Testear con mas convinaciones
  } else {
    return condicion;
  }
}

export default actualizarCondiciones;
*/
async function fetchEstudiante(id) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/estudiantes/${id}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching estudiante:", error);
    throw error;
  }
}
async function fetchTiene(nombreTiene, dni) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/tiene?cond=${nombreTiene}&dni=${dni}`
    );
    return data.map((reg) => reg.id);
  } catch (error) {
    console.error(`Error fetching ${nombreTiene}:`, error);
    throw error;
  }
}
async function fetchMaterias() {
  const { data } = await axios.get("http://localhost:3000/api/materias");
  return data;
}
async function fetchCondicion(nombreCondicion) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/condicion?cond=${nombreCondicion}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching condicion ", nombreCondicion, ":", error);
    throw error;
  }
}
async function ActualizarCondiciones(nombreCondicion, condicion, data, dni) {
  async function sendUpdate(nuevoId, viejoId) {
    const data = {
      id: nuevoId,
    };
    const res = await axios.put(
      "/api/tiene?cond=" + nombreCondicion + "&id=" + viejoId + "&dni=" + dni,
      data
    );
    return res.data;
  }

  async function sendCreate(nuevoId) {
    const data = {
      id: nuevoId,
      dni: dni,
    };
    const res = await axios.post("/api/tiene?cond=" + nombreCondicion, data);
    return res.data;
  }

  async function sendDelete(idElim) {
    const res = await axios.delete(
      "/api/tiene?cond=" + nombreCondicion + "&id=" + idElim + "&dni=" + dni
    );
    if (res.status !== 204) {
      console.log("Error al eliminar materia: ", res);
    }
  }

  if (JSON.stringify(data) !== JSON.stringify(condicion)) {
    //! Si en algun momento se desordenan las listas, esta comparacion podria dar un falso positivo
    const dataAux = data.filter((elemento) => !condicion.includes(elemento));
    //Arreglo de los elementos agregados entre data y condicion
    const condAux = condicion.filter((elemento) => !data.includes(elemento));
    //Arreglo de los elementos eliminados entre data y condicion
    const Iguales = condicion.filter((elemento) => data.includes(elemento));
    //Arreglo de los elementos iguales entre data y condicion

    let salida = [];
    for (let i = 0; i < Iguales.length; i++) {
      salida.push({
        id: Iguales[i],
        dni: dni,
      });
    }
    if (dataAux.length !== condAux.length) {
      if (dataAux.length > condAux.length) {
        let dLenght = dataAux.length;
        for (let i = 0; i < dLenght - condAux.length; i++) {
          salida.push(sendCreate(dataAux[0]));
          dataAux.shift();
        }
      } else {
        let rLenght = condAux.length;
        for (let i = 0; i < rLenght - dataAux.length; i++) {
          sendDelete(condAux[0]);
          condAux.shift();
        }
      }
    }
    if (dataAux.length !== 0 || condAux.length !== 0) {
      // Misma longitud
      for (let i = 0; i < condAux.length; i++) {
        salida.push(sendUpdate(dataAux[0], condAux[i]));
        dataAux.shift();
      }
    }
    // Esperar a que todas las promesas se resuelvan
    salida = await Promise.all(salida);
    return salida.map((reg) => reg.id).sort((a, b) => a - b);
    //TODO: Testear con mas convinaciones
  } else {
    return condicion;
  }
}

function MisMateriasPage() {
  const [estudiante, setEstudiante] = useState();
  const [regularizo, setRegularizo] = useState([]);
  const [aprobo, setAprobo] = useState([]);

  const [materias, setMaterias] = useState([]);
  const [showList, setShowList] = useState([]);
  const [selectedReg, setSelectedReg] = useState(regularizo);
  const [selectedApr, setSelectedApr] = useState(aprobo);
  const [condicionesAp, setCondicionesAp] = useState([]);
  const [condicionesReg, setCondicionesReg] = useState([]);
  const [materiasCursables, setMateriasCursables] = useState([]);
  const [materiasNoCursables, setMateriasNoCursables] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const session = await getSession();
      if (session) {
        try {
          const loadedEstudiante = await fetchEstudiante(session.user.id);
          const loadedRegularizo = await fetchTiene(
            "regularizo",
            loadedEstudiante.dni
          );
          const loadedAprobo = await fetchTiene("aprobo", loadedEstudiante.dni);

          setEstudiante(loadedEstudiante);
          setRegularizo(loadedRegularizo);
          setAprobo(loadedAprobo);

          const loadedMaterias = await fetchMaterias();
          const condicionesRegularizadas = await fetchCondicion("regularizada");
          const condicionesAprobadas = await fetchCondicion("aprobada");

          const listaMaterias = Array.from(
            new Set(
              loadedMaterias
                .filter(
                  (mat) =>
                    mat.nivel === 1 ||
                    loadedRegularizo.includes(mat.id) ||
                    loadedAprobo.includes(mat.id) ||
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
          setCondicionesReg(condicionesRegularizadas);
          setCondicionesAp(condicionesAprobadas);
          setShowList(listaMaterias);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
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

  const handleActualizar = async (dataReg, dataApr) => {
    setSubmitting(true);
    try {
      const [regResult, aprResult] = await Promise.all([
        ActualizarCondiciones(
          "regularizo",
          regularizo,
          dataReg,
          estudiante.dni
        ),
        ActualizarCondiciones("aprobo", aprobo, dataApr, estudiante.dni),
      ]);
      // Actualizar el estado con los resultados
      setRegularizo(regResult);
      setAprobo(aprResult);

      alert("Materias actualizadas");
    } catch (error) {
      console.error("Error al actualizar materias:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* El loading se paso aca para que solucionar el problema de los hooks */}
      {loading ? (
        <Loading />
      ) : (
        <div className="flex justify-center items-center ">
          <FormCondiciones
            materias={materias}
            listaMaterias={showList}
            defaultSelectedReg={regularizo}
            defaultSelectedApr={aprobo}
            onSelectedAprChange={handleSelectedAprChange}
            onSelectedRegChange={handleSelectedRegChange}
            deshabilitar={materiasNoCursables}
            actualizar={handleActualizar}
            loading={submitting}
          />
        </div>
      )}
    </>
  );
}

export default MisMateriasPage;
