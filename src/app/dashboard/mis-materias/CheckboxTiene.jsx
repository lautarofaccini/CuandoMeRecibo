import { Checkbox } from "@nextui-org/react";
import { useState } from "react";

function CheckboxTiene({ defaultSelected, materia, nombreCondicion }) {
  const [isSelected, setIsSelected] = useState(defaultSelected);

  return (
    <div>
      <Checkbox
        isSelected={isSelected}
        onValueChange={setIsSelected}
        name={nombreCondicion}
        value={materia.id}
      >
        <p className="text-black">{materia.id + ". " + materia.asignatura}</p>
      </Checkbox>
    </div>
  );
}

export default CheckboxTiene;