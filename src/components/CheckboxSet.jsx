import { Checkbox } from "@nextui-org/react";
import { useEffect, useState } from "react";

function CheckboxSet({
  regSelected,
  aprSelected,
  materia,
  onSelectionChange,
  disabled,
}) {
  const [isSelectedReg, setIsSelectedReg] = useState(regSelected);
  const [isSelectedApr, setIsSelectedApr] = useState(aprSelected);

  useEffect(() => {
    const clearValues = () => {
      setIsSelectedReg(false);
      setIsSelectedApr(false);
    };
    if (disabled) {
      clearValues();
    }
  }, [disabled]);

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
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">{materia.asignatura}</td>
      <td className="py-3 px-4 text-center">
        <Checkbox
          isSelected={isSelectedReg}
          value={materia.id}
          name={"regularizo"}
          onValueChange={() => toggleSelection(0)}
          isDisabled={disabled}
          aria-label={`Marcar ${materia.asignatura} como Regularizada`}
        />
      </td>
      <td className="py-3 px-4 text-center">
        <Checkbox
          isSelected={isSelectedApr}
          value={materia.id}
          name={"aprobo"}
          onValueChange={() => toggleSelection(1)}
          isDisabled={disabled}
          aria-label={`Marcar ${materia.asignatura} como Aprobada`}
        />
      </td>
    </tr>
  );
}

export default CheckboxSet;
