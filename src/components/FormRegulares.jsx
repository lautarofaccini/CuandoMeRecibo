"use client";

import { Button } from "@nextui-org/react";
import axios from "axios";
import CheckboxRegulares from "./CheckboxRegulares";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

async function fetchMaterias() {
  const { data } = await axios.get("http://localhost:3000/api/materias");
  //TODO: Solo se deben cargar materias de años menores al de la materia en cuestion
  return data;
}
async function fetchRegularizada(idPadre) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/regularizada?id2=${idPadre}`
    );
    return data.map((reg) => reg.idAnteces);
  } catch (error) {
    return [];
  }
}

function FormRegulares({ condicion,  idPadre }) {
  const [materias, setMaterias] = useState([]);
  const [regularizada, setRegularizada] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      const loadedMaterias = await fetchMaterias();
      const loadedRegularizada = await fetchRegularizada(idPadre);
      setMaterias(loadedMaterias);
      setRegularizada(loadedRegularizada);
      setLoading(false);
    }

    loadData();
  }, [idPadre]);

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(condicion)

  async function updateRegular(nuevoId, viejoId) {
    const data = {
      idAnteces: nuevoId,
    };
    const res = await axios.put(
      "/api/regularizada?id1=" + viejoId + "&id2=" + idPadre,
      data
    );
    return res.data;
  }

  async function createRegular(nuevoId) {
    const data = {
      idAnteces: nuevoId,
      idSuces: idPadre
    };
    const res = await axios.post(
      "/api/regularizada",
      data
    );
    return res.data;
  }

  async function deleteRegular(idElim) {
    const res = await axios.delete(
      "/api/regularizada?id1=" + idElim + "&id2=" + idPadre
    );
    if (res.status !== 204) {
      console.log(
        "Error al eliminar materia: ", res
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    const formData = new FormData(e.target);
    const data = formData.getAll("checklist").map((item) => parseInt(item, 10));
    //! Si algun item no se puede convertir, parseInt devuelve NaN

    if (JSON.stringify(data) !== JSON.stringify(regularizada)) {
      //! Si en algun momento se desordenan las listas, esta comparacion podria dar un falso positivo
      const dataAux = data.filter(
        (elemento) => !regularizada.includes(elemento)
      );
      const regAux = regularizada.filter(
        (elemento) => !data.includes(elemento)
      );
      const Iguales = regularizada.filter((elemento) =>
        data.includes(elemento)
      );
      let regSal = [];
      for (let i = 0; i < Iguales.length; i++) {
        regSal.push({
          idAnteces: Iguales[i],
          idSuces: idPadre,
        });
      }
      if (dataAux.length !== regAux.length) {
        if (dataAux.length > regAux.length) {
          let dLenght = dataAux.length;
          for (let i = 0; i < dLenght - regAux.length; i++) {
            regSal.push(createRegular(dataAux[0]));
            dataAux.shift();
          }
        } else {
          let rLenght = regAux.length;
          for (let i = 0; i < rLenght - dataAux.length; i++) {
            deleteRegular(regAux[0]);
            regAux.shift();
          }
        }
      }
      if (dataAux.length !== 0 || regAux.length !== 0) {
        // Misma longitud
        for (let i = 0; i < regAux.length; i++) {
          regSal.push(updateRegular(dataAux[0], regAux[i]));
          dataAux.shift();
        }
      }
      // Esperar a que todas las promesas se resuelvan
      regSal = await Promise.all(regSal);
      setRegularizada(regSal.map((reg) => reg.idAnteces).sort((a, b) => a - b));
      alert("Correlatividades actualizadas")
      //TODO: Testear con mas convinaciones
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ul>
        {materias.map((materia) => (
          <li key={materia.id}>
            <CheckboxRegulares
              defaultSelected={regularizada.includes(materia.id)}
              materia={materia}
            />
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Button type="submit" className=" mt-3">
          Guardar
        </Button>
      </div>
    </form>
  );
}

export default FormRegulares;
