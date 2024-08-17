import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FormTiene from "./FormTiene";

async function MisMateriasPage() {
  const session = await getServerSession(authOptions);
  //TODO: Enviar a FormTiene las materias del estudiante y mostrar las materias que puede asignarse como aprobada o regularizada
  return (
    <div>
      <FormTiene
        listaCondicion={aprobada}
      />
    </div>
  );
}

export default MisMateriasPage;
