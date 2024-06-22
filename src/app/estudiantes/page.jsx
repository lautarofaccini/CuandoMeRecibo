import CardEstudiante from "@/components/CardEstudiante";
import axios from "axios";

async function loadEstudiantes() {
  const { data } = await axios.get("http://localhost:3000/api/estudiantes");
  return data;
}

async function Estudiantes() {
  const estudiantes = await loadEstudiantes();
  console.log(estudiantes);

  return (
    <div className="grid gap-4 grid-cols-4">
      {estudiantes.map((estudiante) => (
        <CardEstudiante estudiante={estudiante} key={estudiante.id}/>
      ))}
    </div>
  );
}

export default Estudiantes;
