import { Checkbox } from "@nextui-org/react";
import axios from "axios";

async function loadMaterias() {
  const { data } = await axios.get("http://localhost:3000/api/materias");
  return data;
}

async function FormRegulares() {
  const materias = await loadMaterias();

  return (
    <div>
      <ul>
        {materias.map((materia) => (
          <li key={materia.id}>
            <div>
              <Checkbox>
                <p className="text-black">{materia.asignatura}</p>
              </Checkbox>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FormRegulares;
