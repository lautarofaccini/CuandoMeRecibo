import { Checkbox } from "@nextui-org/react";
import { useState } from "react";

function CheckboxTiene({ materia }) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex justify-center">
            <Checkbox value={materia.id} />
          </div>
          <div className="flex justify-center">
            <Checkbox value={materia.id} />
          </div>
    </div>
  );
}

export default CheckboxTiene;
