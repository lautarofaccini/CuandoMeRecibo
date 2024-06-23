"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

function Buttons({ estudianteId }) {
  const router = useRouter();

  return (
    <div className="flex gap-x-2 justify-end mt-2">
      <button
        className="text-white bg-red-500 hover:bg-red-700 py-2 px-3 rounded"
        onClick={async () => {
          if (confirm("¿Seguro que quieres borrar al estudiante?")) {
            const res = await axios.delete(`/api/estudiantes/${estudianteId}`);
            if (res.status === 204) {
              router.push("/estudiantes");
              router.refresh();
            }
          }
        }}
      >
        Delete
      </button>
      <button
        className="text-white bg-gray-500 hover:bg-gray-700 py-2 px-3 rounded"
        onClick={() => {
          router.push("/estudiantes/edit/" + estudianteId);
          router.refresh();
        }}
      >
        Edit
      </button>
    </div>
  );
}

export default Buttons;
