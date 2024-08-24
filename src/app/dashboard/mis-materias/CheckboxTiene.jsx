import { Checkbox } from "@nextui-org/react";
import { useState } from "react";

function CheckboxTiene({ materia }) {
  const [isSelectedReg, setIsSelectedReg] = useState(false);
  const [isSelectedApr, setIsSelectedApr] = useState(false);

  function toggleSelection(box) {
    if (box === 0) {
      if (isSelectedReg) {
        setIsSelectedReg(false);
      } else {
        setIsSelectedReg(true);
        setIsSelectedApr(false);
      }
    } else if (box === 1) {
      if (isSelectedApr) {
        setIsSelectedApr(false);
      } else {
        setIsSelectedApr(true);
        setIsSelectedReg(false);
      }
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex justify-center">
        <Checkbox
          isSelected={isSelectedReg}
          value={materia.id}
          name={"regularizada"}
          onValueChange={() => toggleSelection(0)}
        />
      </div>
      <div className="flex justify-center">
        <Checkbox
          isSelected={isSelectedApr}
          value={materia.id}
          name={"aprobada"}
          onValueChange={() => toggleSelection(1)}
        />
      </div>
    </div>
  );
}

export default CheckboxTiene;