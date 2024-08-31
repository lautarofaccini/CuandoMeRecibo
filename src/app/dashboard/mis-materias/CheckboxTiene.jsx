import { Checkbox } from "@nextui-org/react";
import { useState } from "react";

function CheckboxTiene({ regSelected, aprSelected, materia, onSelectionChange }) {
  const [isSelectedReg, setIsSelectedReg] = useState(regSelected);
  const [isSelectedApr, setIsSelectedApr] = useState(aprSelected);

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
  );
}

export default CheckboxTiene;