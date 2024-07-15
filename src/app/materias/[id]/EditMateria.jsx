"use client";
import axios from "axios";
import Buttons from "./Buttons";
import { Button } from "@nextui-org/react";
import FormCondicion from "./FormCondicion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotFound from "@/app/not-found";

async function fetchCondicion(nombreCondicion, idPadre) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/condicion?cond=${nombreCondicion}&id2=${idPadre}`
    );
    return data.map((reg) => reg.idAnteces);
  } catch (error) {
    console.error("Error fetching condicion:", error);
    throw error;
  }
}

async function ActualizarCondiciones(nombreCondicion, condicion, data, id) {
  async function updateRegular(nuevoId, viejoId) {
    const data = {
      idAnteces: nuevoId,
    };
    const res = await axios.put(
      "/api/condicion?cond=" +
        nombreCondicion +
        "&id1=" +
        viejoId +
        "&id2=" +
        id,
      data
    );
    return res.data;
  }

  async function createRegular(nuevoId) {
    const data = {
      idAnteces: nuevoId,
      idSuces: id,
    };
    const res = await axios.post(
      "/api/condicion?cond=" + nombreCondicion,
      data
    );
    return res.data;
  }

  async function deleteRegular(idElim) {
    const res = await axios.delete(
      "/api/condicion?cond=" + nombreCondicion + "&id1=" + idElim + "&id2=" + id
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
        idAnteces: Iguales[i],
        idSuces: id,
      });
    }
    if (dataAux.length !== condAux.length) {
      if (dataAux.length > condAux.length) {
        let dLenght = dataAux.length;
        for (let i = 0; i < dLenght - condAux.length; i++) {
          salida.push(createRegular(dataAux[0]));
          dataAux.shift();
        }
      } else {
        let rLenght = condAux.length;
        for (let i = 0; i < rLenght - dataAux.length; i++) {
          deleteRegular(condAux[0]);
          condAux.shift();
        }
      }
    }
    if (dataAux.length !== 0 || condAux.length !== 0) {
      // Misma longitud
      for (let i = 0; i < condAux.length; i++) {
        salida.push(updateRegular(dataAux[0], condAux[i]));
        dataAux.shift();
      }
    }
    // Esperar a que todas las promesas se resuelvan
    salida = await Promise.all(salida);
    return salida.map((reg) => reg.idAnteces).sort((a, b) => a - b);
    //TODO: Testear con mas convinaciones
  } else {
    return condicion;
  }
}

function EditMateria({ paramId }) {
  const [materia, setMateria] = useState([]);
  const [regularizada, setRegularizada] = useState([]);
  const [aprobada, setAprobada] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const loadedMateria = await fetchMateria();
        setMateria(loadedMateria);
        const loadedRegularizada = await fetchCondicion(
          "regularizada",
          paramId
        );
        const loadedAprobada = await fetchCondicion("aprobada", paramId);
        setRegularizada(loadedRegularizada);
        setAprobada(loadedAprobada);
      } catch (error) {
        if (error.message === "Materia not found") {
          setNotFound(true);
        } else {
          console.log(error);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [paramId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (notFound) {
    return <NotFound />;
  }

  async function fetchMateria() {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/materias/${paramId}`
      );
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

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dataReg = formData
      .getAll("regularizada")
      .map((item) => parseInt(item, 10));
    const dataAp = formData
      .getAll("aprobada")
      .map((item) => parseInt(item, 10));

    try {
      const [regResult, apResult] = await Promise.all([
        ActualizarCondiciones("regularizada", regularizada, dataReg, paramId),
        ActualizarCondiciones("aprobada", aprobada, dataAp, paramId),
      ]);
      // Actualizar el estado con los resultados
      setRegularizada(regResult);
      setAprobada(apResult);

      alert("Correlatividades actualizadas");
    } catch (error) {
      console.error("Error al actualizar correlatividades:", error);
      router.push("/materias");
    }
  };
  return (
    <div className="flex justify-center items-center gap-x-4">
      <div className="p-6 bg-white rounded">
        <p>Numero de materia: {materia.id}</p>
        <p>Nombre de materia: {materia.asignatura}</p>
        <p>Año: {materia.nivel}</p>
        {materia.dictado ? <p>Dictado: {materia.dictado}</p> : null}
        {materia.plan ? <p>Plan: {materia.plan}</p> : null}
        <Buttons materia={materia} onShowForm={handleShowForm} />
      </div>
      {showForm && (
        <div className="p-6 bg-slate-500 rounded">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center items-center gap-x-4">
              <FormCondicion
                nombreCondicion="regularizada"
                materia={materia}
                listaCondicion={regularizada}
              />
              <FormCondicion
                nombreCondicion="aprobada"
                materia={materia}
                listaCondicion={aprobada}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="mt-3">
                Guardar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditMateria;
