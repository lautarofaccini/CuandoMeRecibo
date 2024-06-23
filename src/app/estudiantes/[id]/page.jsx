import axios from "axios";
import Buttons from "./Buttons";

async function loadEstudiante(estudianteId) {
  const { data } = await axios.get(
    `http://localhost:3000/api/estudiantes/${estudianteId}`
  );
  return data;
}

async function EstudiantePage({ params }) {
  const estudiante = await loadEstudiante(params.id);
  return (
    <section className="flex justify-center items-center">
      <div className="p-6 bg-white rounded">
        <p>Nombre: {estudiante.nombre}</p>
        <p>Apellido: {estudiante.apellido}</p>
        <p>DNI: {estudiante.dni}</p>
        <p>Fecha de nacimiento: {estudiante.fechaNac}</p>
        <Buttons estudianteId={estudiante.id}/>
      </div>
    </section>
  );
}

export default EstudiantePage;
