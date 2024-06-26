"use client";

import { Button } from "@nextui-org/react";
import axios from "axios";
import CheckboxRegulares from "./CheckboxRegulares";

async function loadMaterias() {
  const { data } = await axios.get("http://localhost:3000/api/materias");
  return data;
}
async function loadRegularizada(idPadre) {
  const {data} = await axios.get(`http://localhost:3000/api/regularizada?id2=${idPadre}`);
  return data[0]
}

async function FormRegulares({ idPadre }) {
  const materias = await loadMaterias();
  const regularizada = await loadRegularizada(idPadre);
  //console.log(regularizada.idAnteces); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    const formData = new FormData(e.target);
    const data = formData.getAll("checklist").map((item) => parseInt(item, 10));
    //! Si algun item no se puede convertir, parseInt devuelve NaN
    console.log(data)
  };

  return (
    <form onSubmit={handleSubmit}>
      <ul>
        {materias.map((materia) => (
          <li key={materia.id}>
            <CheckboxRegulares materia={materia} />
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
