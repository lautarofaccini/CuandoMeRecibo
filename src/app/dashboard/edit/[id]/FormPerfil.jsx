import { Button } from "@nextui-org/react";

function FormPerfil() {
    return (
        <form
          className="bg-white shadow-md px-8 pt-6 pb-8"
          onSubmit={handleSubmit}
          ref={form}
        >
          <h1 className="block text-slate-900 text-xl font-bold mb-2">
            Nuevo Estudiante
          </h1>
          <label
            htmlFor="dni"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            DNI
          </label>
          <input
            name="dni"
            type="text"
            placeholder="XXXXXXXX"
            onChange={handleChange}
            value={estudiante.dni}
            className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3 mb-1"
            autoFocus
          />
    
          <label
            htmlFor="nombre"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Nombre
          </label>
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            onChange={handleChange}
            value={estudiante.nombre}
            className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3 mb-1"
          />
          <label
            htmlFor="apellido"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Apellido
          </label>
          <input
            name="apellido"
            type="text"
            placeholder="Apellido"
            onChange={handleChange}
            value={estudiante.apellido}
            className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3 mb-1"
          />
    
          <label
            htmlFor="fechaNac"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Fecha de Nacimiento
          </label>
          <input
            name="fechaNac"
            type="date"
            onChange={handleChange}
            value={estudiante.fechaNac}
            className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3 mb-1"
          />
          <Button>
            Guardar
          </Button>
        </form>
      );
}

export default FormPerfil