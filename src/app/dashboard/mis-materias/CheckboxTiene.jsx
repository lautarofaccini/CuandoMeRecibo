import { Checkbox } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";

async function fetchAntecesores(id) {
  const { data } = await axios.get(
    `http://localhost:3000/api/condicion/antecesores?id=${id}`
  );
  return data;
}

function CheckboxTiene({
  regSelected,
  aprSelected,
  materia,
  onSelectionChange,
}) {
  const [isSelectedReg, setIsSelectedReg] = useState(regSelected);
  const [isSelectedApr, setIsSelectedApr] = useState(aprSelected);
  const [regularizada, setRegularizada] = useState();
  const [aprobada, setAprobada] = useState();

  useEffect(() => {
    async function loadData() {
      try {
        const { regularizada, aprobada } = await fetchAntecesores(materia.id);
        // Agrega materias de 1ro y materias que regularizo/aprobo
        setRegularizada(regularizada);
        setAprobada(aprobada);
      } catch (error) {
        console.error("Error fetching antecesores:", error);
      }
    }

    loadData();
  }, []);

  function toggleSelection(box) {
    if (box === 0) {
      if (isSelectedReg) {
        setIsSelectedReg(false);
        onSelectionChange(materia.id, "regularizo", !isSelectedReg);
      } else {
        setIsSelectedReg(true);
        setIsSelectedApr(false);
        onSelectionChange(materia.id, "regularizo", !isSelectedReg);
      }
    } else if (box === 1) {
      if (isSelectedApr) {
        setIsSelectedApr(false);
        onSelectionChange(materia.id, "aprobo", !isSelectedApr);
      } else {
        setIsSelectedApr(true);
        setIsSelectedReg(false);
        onSelectionChange(materia.id, "aprobo", !isSelectedApr);
      }
    }
  }

  return (
    <div className="content-center grid grid-cols-3 gap-4">
      <p className="col-span-2">{materia.asignatura}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-center">
          <Checkbox
            isSelected={isSelectedReg}
            value={materia.id}
            name={"regularizo"}
            onValueChange={() => toggleSelection(0)}
          />
        </div>
        <div className="flex justify-center">
          <Checkbox
            isSelected={isSelectedApr}
            value={materia.id}
            name={"aprobo"}
            onValueChange={() => toggleSelection(1)}
          />
        </div>
      </div>
    </div>
  );
}

export default CheckboxTiene;
