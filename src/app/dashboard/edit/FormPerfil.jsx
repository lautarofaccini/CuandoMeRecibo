"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, DateInput, Form, Input } from "@heroui/react";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import axios from "axios";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

//Objetivo del componente:
//Ser un formulario para editar los datos de usuario
//Permitir crear datos de estudiante para ese usuario
//Permitir editar los datos de estudiante para ese usuario

async function fetchEstudiante(id) {
  try {
    const { data: estudiante } = await axios.get(`/api/estudiantes/${id}`);
    return estudiante;
  } catch (error) {
    if (error.response === 404) {
      return null;
    } else {
      console.log(error);
    }
  }
}

function FormPerfil() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [estudiante, setEstudiante] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    fechaNac: null,
  });
  const [dateValue, setDateValue] = useState(null);
  // Estado para los datos de usuario (editables) y copia inicial para comparar
  const [user, setUser] = useState();
  // Estado para guardar la data original del estudiante (si existe) para comparar cambios
  const [initialEst, setInitialEst] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!session) return;
    const loadData = async () => {
      const loadedEst = await fetchEstudiante(session.user.id);
      setUser({
        username: session.user.name,
        email: session.user.email,
      });
      if (loadedEst) {
        // Asigna el resto de los datos al estado si lo necesitas
        setEstudiante(loadedEst);
        setInitialEst(loadedEst);
        if (loadedEst.fechaNac) {
          // Suponiendo que fechaNac viene en formato "YYYY-MM-DD"
          const [year, month, day] = loadedEst.fechaNac.split("-").map(Number);
          const calendarDate = new CalendarDate(year, month, day);
          setDateValue(calendarDate);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [session]);

  // Mientras se carga la sesión, mostramos cargando
  if (loading) {
    return <Loading />;
  }

  const handleChange = (e) => {
    setEstudiante({
      ...estudiante,
      [e.target.name]: e.target.value,
    });
  };

  // Manejador para los campos de usuario (username y email)
  const handleUserChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
    if (newValue) {
      // Convertir a Date, obtener el string ISO y extraer solo la parte de la fecha
      const date = newValue
        .toDate(getLocalTimeZone())
        .toISOString()
        .split("T")[0];
      setEstudiante((prev) => ({ ...prev, fechaNac: date }));
    } else {
      setEstudiante((prev) => ({ ...prev, fechaNac: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comparar datos del usuario: solo enviar los que cambiaron
    const updatedUser = {};
    if (user.username !== session.user.name)
      updatedUser.username = user.username;
    if (user.email !== session.user.email) updatedUser.email = user.email;

    // Comparar datos del estudiante: si ya existe, enviar solo lo modificado
    let updatedEst = {};
    if (initialEst) {
      if (estudiante.dni !== initialEst.dni) updatedEst.dni = estudiante.dni;
      if (estudiante.nombre !== initialEst.nombre)
        updatedEst.nombre = estudiante.nombre;
      if (estudiante.apellido !== initialEst.apellido)
        updatedEst.apellido = estudiante.apellido;
      if (estudiante.fechaNac !== initialEst.fechaNac)
        updatedEst.fechaNac = estudiante.fechaNac;
    } else {
      // Si no existe, se envía todo
      updatedEst = { ...estudiante };
    }

    // Si no hay cambios en ningún lado, no se envía nada
    if (
      Object.keys(updatedUser).length === 0 &&
      Object.keys(updatedEst).length === 0
    ) {
      alert("No hay cambios para actualizar");
      return;
    }

    try {
      // Actualizar o crear datos del estudiante
      if (initialEst) {
        if (Object.keys(updatedEst).length > 0) {
          console.log(
            "actualizando datos a: /api/estudiantes/" +
              session.user.id +
              " con: "
          );
          const { data } = await axios.put(
            `/api/estudiantes/${session.user.id}`,
            updatedEst
          );
        }
      } else {
        // Si no existe, crear uno nuevo
        const { data } = await axios.post(`/api/estudiantes`, {
          ...estudiante,
          id: session.user.id,
        });
        setInitialEst(data);
      }
      // Actualizar datos del usuario (suponiendo que exista un endpoint para ello)
      if (Object.keys(updatedUser).length > 0) {
        const { data } = await axios.put(
          `/api/auth/register/${session.user.id}`,
          updatedUser
        );
        setUser({ username: data.username, email: data.email });
      }
      alert("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar los datos");
    } finally {
      router.refresh();
    }
  };

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-3"
      validationErrors={errors}
      onSubmit={handleSubmit}
    >
      <h1 className="block text-xl font-bold mb-2">Perfil de Usuario</h1>
      <Input
        name="username"
        label="Nombre de usuario"
        labelPlacement="outside"
        errorMessage="Please enter a valid username"
        onChange={handleUserChange}
        value={user.username}
        type="text"
      />
      <Input
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        onChange={handleUserChange}
        value={user.email}
        type="email"
      />
      <Button
        onPress={() => {
          alert("Not yet buddy");
        }}
      >
        Cambiar Contraseña
      </Button>
      <h1 className="block text-xl font-bold mb-2">Perfil de Estudiante</h1>
      <Input
        name="dni"
        label="DNI"
        labelPlacement="outside"
        placeholder="XXXXXXXX"
        onChange={handleChange}
        value={estudiante.dni}
        type="text"
      />
      <Input
        name="nombre"
        label="Nombre"
        labelPlacement="outside"
        placeholder="Nombre"
        onChange={handleChange}
        value={estudiante.nombre}
        type="text"
      />
      <Input
        name="apellido"
        label="Apellido"
        labelPlacement="outside"
        placeholder="Apellido"
        onChange={handleChange}
        value={estudiante.apellido}
        type="text"
      />
      <DateInput
        label="Fecha de Nacimiento"
        labelPlacement="outside"
        value={dateValue}
        placeholderValue={new CalendarDate(1995, 11, 6)}
        onChange={handleDateChange}
      />
      <Button type="submit">Guardar</Button>
    </Form>
  );
}

export default FormPerfil;
