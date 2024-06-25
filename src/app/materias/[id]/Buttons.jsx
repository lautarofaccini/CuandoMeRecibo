"use client";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";


function Buttons({ materiaId }) {
  const router = useRouter();
 function showCorrelativas(){
  console.log("TODO: Hacer que este boton despliegue el formulario")
 }
  return (
    <div className="flex gap-x-2 justify-end mt-2">
      <Button
        className="text-white bg-red-500 hover:bg-red-700 py-2 px-3 rounded"
        onClick={async () => {
          if (confirm("¿Seguro que quieres borrar esta materia?")) {
            const res = await axios.delete(`/api/materias/${materiaId}`);
            if (res.status === 204) {
              router.push("/materias");
              router.refresh();
            }
          }
        }}
      >
        Delete
      </Button>
      <Button
        className="text-white bg-slate-500 hover:bg-slate-700 py-2 px-3 rounded"
        onClick={() => {
          router.push("/materias/edit/" + materiaId);
          router.refresh();
        }}
      >
        Edit
      </Button>
      <Button
      className="text-white bg-gray-500 hover:bg-gray-700 py-2 px-3 rounded"
      onClick={()=>{showCorrelativas()}}
      >
        Correlatividad
      </Button>

    </div>
  );
}

export default Buttons;
