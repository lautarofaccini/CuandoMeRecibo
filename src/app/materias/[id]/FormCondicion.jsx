import CheckboxCondicion from "./CheckboxCondicion";

function FormCondicion({ nombreCondicion, materia, listaCondicion, materias }) {
  return (
    <div>
      <h1 className="font-bold text-2xl mb-4 text-gray-800">
        {nombreCondicion === "regularizada" ? "Regular" : "Aprobado"}
      </h1>
      <ul>
        {materias
          .filter((mat) => mat.id !== materia.id && mat.nivel <= materia.nivel)
          .map((mat) => (
            <li key={mat.id} className="flex items-center">
              <CheckboxCondicion
                defaultSelected={listaCondicion.includes(mat.id)}
                materia={mat}
                nombreCondicion={nombreCondicion}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}

export default FormCondicion;
