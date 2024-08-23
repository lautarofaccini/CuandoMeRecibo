"use client";
import { Button } from "@nextui-org/react";
import FormTiene from "./FormTiene";
function MisMateriasPage() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData);
    /* const dataReg = formData
      .getAll("regularizada")
      .map((item) => parseInt(item, 10));
    const dataAp = formData
      .getAll("aprobada")
      .map((item) => parseInt(item, 10)); 

    try {
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
    }
      */
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
