import { Checkbox } from "@nextui-org/react";
import { useState } from "react";

function CheckboxRegulares({ materia }) {

    const [isSelected, setIsSelected] = useState(false)

  return (
    <div>
      <Checkbox isSelected={isSelected} onValueChange={setIsSelected} name="checklist" value={materia.id}>
        <p className="text-black">{materia.asignatura}</p>
      </Checkbox>
    </div>
  );
}

export default CheckboxRegulares;
