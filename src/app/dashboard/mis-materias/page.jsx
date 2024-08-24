"use client";
import { Button } from "@nextui-org/react";
import FormTiene from "./FormTiene";

/* async function ActualizarCondiciones(nombreCondicion, condicion, data, id) {
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
} */

function MisMateriasPage() {
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData);
    const dataReg = formData
      .getAll("regularizada")
      .map((item) => parseInt(item, 10));
    const dataAp = formData
      .getAll("aprobada")
      .map((item) => parseInt(item, 10));
      //TODO: Adaptar esto a este caso
      //TODO: Enviar a la base de datos las materias para este alumno
      //TODO: Tiene q mandar el dni y el id de la materia para vincular a los dos 
    /* try {
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
    } */
  };

  return (
    <div className="flex justify-center items-center ">
      <form className="p-6 bg-slate-500 rounded" onSubmit={handleSubmit}>
        <FormTiene />
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
