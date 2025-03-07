import axios from "axios";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

function Buttons({ materia, onShowForm }) {
  const router = useRouter();

  return (
    <div className="flex gap-x-2 justify-end mt-2">
      <Button
        className="bg-red-500 hover:bg-red-700 py-2 px-3 rounded"
        onPress={async () => {
          if (confirm("¿Seguro que quieres borrar esta materia?")) {
            const res = await axios.delete(`/api/materias/${materia.id}`);
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
        className="bg-slate-500 hover:bg-slate-700 py-2 px-3 rounded"
        onPress={() => {
          router.push("/materias/edit/" + materia.id);
          router.refresh();
        }}
      >
        Edit
      </Button>
      <Button
        className="bg-gray-500 hover:bg-gray-700 py-2 px-3 rounded"
        onPress={onShowForm}
      >
        Correlatividad
      </Button>
    </div>
  );
}

export default Buttons;
