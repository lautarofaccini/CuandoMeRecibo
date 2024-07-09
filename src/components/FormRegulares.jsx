"use client";

import { Button } from "@nextui-org/react";
import axios from "axios";
import CheckboxRegulares from "./CheckboxRegulares";

async function loadMaterias() {
  const { data } = await axios.get("http://localhost:3000/api/materias");
  //TODO: Solo se deben cargar materias de años menores al de la materia en cuestion
  return data;
}
async function loadRegularizada(idPadre) {
  try {
    const { data } = await axios.get(
      `http://localhost:3000/api/regularizada?id2=${idPadre}`
    );
    return data.map((reg) => reg.idAnteces);
  } catch (error) {
    return [];
  }
}

function updateRegular(nuevoId) {
  console.log("actualizado: ", nuevoId);
}

function createRegular(nuevoId) {
  console.log("creado: ", nuevoId);
}

function deleteRegular(nuevoId) {
  console.log("borrado: ", nuevoId);
}

async function FormRegulares({ idPadre }) {
  const materias = await loadMaterias();
  const regularizada = await loadRegularizada(idPadre);

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
      if (dataAux.length !== regAux.length) {
        if (dataAux.length > regAux.length) {
          let dLenght = dataAux.length;
          for (let i = 0; i < dLenght - regAux.length; i++) {
            createRegular(dataAux[0]);
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
      if (dataAux.length !== 0 || regAux.length !== 0){
        // Misma longitud
        for (let i = 0; i < regAux.length; i++) {
          updateRegular(dataAux[0]);
          dataAux.shift();
        }
      }
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
