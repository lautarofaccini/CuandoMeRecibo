import CardMateria from "@/components/CardMateria";
import axios from "axios";

async function loadMaterias() {
  const { data } = await axios.get("http://localhost:3000/api/materias"); 
  return data;
}

async function Materias() {
  const materias = await loadMaterias();

  return (
    <div className="grid gap-4 grid-cols-4">
      {materias.map((materia) => (
        <CardMateria materia={materia} key={materia.id} />
      ))}
    </div>
  );
}

export default Materias;
