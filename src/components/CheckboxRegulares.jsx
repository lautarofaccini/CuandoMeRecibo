import { Checkbox } from "@nextui-org/react";
import { useState } from "react";

function CheckboxRegulares({ defaultSelected, materia }) {

    const [isSelected, setIsSelected] = useState(defaultSelected)

  return (
    <div>
      <Checkbox isSelected={isSelected} onValueChange={setIsSelected} name="checklist" value={materia.id}>
        <p className="text-black">{materia.asignatura}</p>
      </Checkbox>
    </div>
  );
}

export default CheckboxRegulares;
