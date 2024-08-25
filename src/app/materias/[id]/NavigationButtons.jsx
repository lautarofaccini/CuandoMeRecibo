"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function NavigationButtons({ paramId }) {
  const router = useRouter();
  return (
    <div className="flex justify-end gap-2">
      {paramId !== 1 && (
        <Button
          className="bg-blue-500 hover:bg-blue-700 py-2 px-3 rounded"
          onClick={() => {
            const prevId = parseInt(paramId, 10) - 1;
            router.push("/materias/" + prevId);
          }}
        >
          Anterior
        </Button>
      )}
      <Button
        className="bg-blue-500 hover:bg-blue-700 py-2 px-3 rounded"
        onClick={() => {
          const nextId = parseInt(paramId, 10) + 1;
          router.push("/materias/" + nextId);
          //TODO: Comprobar que la siguiente exista
        }}
      >
        Siguiente
      </Button>
    </div>
  );
}

export default NavigationButtons;
