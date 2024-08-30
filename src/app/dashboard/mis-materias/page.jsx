"use client";
import { Button } from "@nextui-org/react";
import FormTiene from "./FormTiene";
import { getSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

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

function MisMateriasPage() {
  const [estudiante, setEstudiante] = useState();
  const [regularizo, setRegularizo] = useState([]);
  const [aprobo, setAprobo] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    async function loadData() {
      const session = await getSession();
      if (session) {
        try {
          const loadedEstudiante = await fetchEstudiante(session.user.id);
          setEstudiante(loadedEstudiante);
          const loadedRegularizo = await fetchTiene(
            "regularizo",
            loadedEstudiante.dni
          );
          const loadedAprobo = await fetchTiene("aprobo", loadedEstudiante.dni);
          setRegularizo(loadedRegularizo);
          setAprobo(loadedAprobo);
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <Loading/>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dataReg = formData
      .getAll("regularizo")
      .map((item) => parseInt(item, 10));
    const dataApr = formData.getAll("aprobo").map((item) => parseInt(item, 10));
    //TODO: Adaptar esto a este caso
    //TODO: Enviar a la base de datos las materias para este alumno
    //TODO: Tiene q mandar el dni y el id de la materia para vincular a los dos
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
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <form className="p-6 bg-slate-500 rounded" onSubmit={handleSubmit}>
        <FormTiene regularizo={regularizo} aprobo={aprobo} />
        <div className="flex justify-end">
          <Button type="submit" className="mt-3">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default MisMateriasPage;
