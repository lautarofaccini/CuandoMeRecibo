import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import CheckboxSet from "./CheckboxSet";

// Funciones predeterminadas que no hacen nada
const noop = () => {};

function FormCondiciones({
  materias,
  listaMaterias,
  defaultSelectedReg,
  defaultSelectedApr,
  onSelectedRegChange = noop,
  onSelectedAprChange = noop,
  deshabilitar,
  actualizar,
  loading,
}) {
  //selectedApr y selectedReg son las materias que se seleccionan en el formulario, actualizadas dinamicamente
  const [selectedApr, setSelectedApr] = useState(defaultSelectedApr);
  const [selectedReg, setSelectedReg] = useState(defaultSelectedReg);
  const [materiasMostradas, setMateriasMostradas] = useState(listaMaterias);
  const [mostrarTodo, setMostrarTodo] = useState(false);

  useEffect(() => {
    if (mostrarTodo) {
      setMateriasMostradas(materias);
    } else {
      setMateriasMostradas(listaMaterias);
    }
  }, [mostrarTodo, listaMaterias]);

  useEffect(() => {
    onSelectedAprChange(selectedApr);
  }, [selectedApr, onSelectedAprChange]);

  useEffect(() => {
    onSelectedRegChange(selectedReg);
  }, [selectedReg, onSelectedRegChange]);

  // Maneja la actualización de las materias regularizadas o aprobadas
  const handleSelectionChange = (id, type, value) => {
    if (type === "regularizo") {
      if (value) {
        setSelectedReg((prev) => [...prev, id]);
        setSelectedApr((prev) => prev.filter((item) => item !== id));
      } else {
        setSelectedReg((prev) => prev.filter((item) => item !== id));
      }
    } else if (type === "aprobo") {
      if (value) {
        setSelectedApr((prev) => [...prev, id]);
        setSelectedReg((prev) => prev.filter((item) => item !== id));
      } else {
        setSelectedApr((prev) => prev.filter((item) => item !== id));
      }
    } else {
      console.error("Error en handleSelectionChange");
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dataReg = formData
      .getAll("regularizo")
      .map((item) => parseInt(item, 10));
    const dataApr = formData.getAll("aprobo").map((item) => parseInt(item, 10));
    actualizar(dataReg, dataApr);
  };

  // Reiniciar formulario
  const handleReset = () => {
    setSelectedConditions({});
    setSubmitted(false);
  };

  const handleMostrarTodo = () => {
    if (mostrarTodo) {
      setMostrarTodo(false);
    } else {
      setMostrarTodo(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <div className="w-full max-w-4xl mx-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        {/* Encabezado */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-center">
            Condiciones de Materias
          </h2>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <div className="overflow-x-auto">
                <div className="max-h-[60vh] overflow-y-auto">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium">
                          Materia
                        </th>
                        <th className="py-3 px-4 text-center font-medium">
                          Regularizada
                        </th>
                        <th className="py-3 px-4 text-center font-medium">
                          Aprobada
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {materiasMostradas.map((materia) => (
                        <CheckboxSet
                          key={materia.id}
                          regSelected={defaultSelectedReg.includes(materia.id)}
                          aprSelected={defaultSelectedApr.includes(materia.id)}
                          materia={materia}
                          onSelectionChange={handleSelectionChange}
                          disabled={
                            deshabilitar && deshabilitar.includes(materia.id)
                          }
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={handleMostrarTodo}>
                {mostrarTodo ? "Mostrar Menos" : "Mostrar Todo"}
              </Button>
              <Button type="submit" isLoading={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </div>

        {/* Pie */}
        <div className="p-6 pt-0 text-sm text-gray-500 text-center">
          Selecciona una condición para cada materia.
        </div>
      </div>
    </div>
  );
}

export default FormCondiciones;
