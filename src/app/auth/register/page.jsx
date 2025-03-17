"use client";
import React, { useState } from "react";
import { Form, Input, Button } from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function RegisterPage() {
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const newErrors = {};

    if (!data.username) newErrors.username = "Nombre de usuario requerido";
    if (!data.email) newErrors.email = "Correo requerido";
    if (!data.password) newErrors.password = "Contraseña requerida";
    if (!data.confirmPassword)
      newErrors.confirmPassword = "Repetir contraseña requerido";
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      setSubmitting(false);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      if (res.status === 200) {
        const res = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (res.ok) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setErrorMessage(res.error);
        }
      }
    } catch (error) {
      if (error.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Error en el registro. Inténtalo de nuevo");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <Form
        className="w-1/4 flex flex-col gap-4"
        validationErrors={errors}
        onSubmit={onSubmit}
      >
        {errorMessage && (
          <p className="bg-red-500 text-lg text-white p-3 rounded">
            {errorMessage}
          </p>
        )}
        <h1 className="text-slate-200 font-bold text-3xl mb-4">Registrar</h1>
        <Input
          isRequired
          errorMessage={errors.username}
          label="Nombre de usuario"
          labelPlacement="outside"
          name="username"
          placeholder="usuario123"
          type="text"
        />
        <Input
          isRequired
          errorMessage={errors.email}
          label="Correo"
          labelPlacement="outside"
          name="email"
          placeholder="correo@email.com"
          type="email"
        />
        <Input
          isRequired
          errorMessage={errors.password}
          label="Contraseña"
          labelPlacement="outside"
          name="password"
          placeholder="********"
          type="password"
        />
        <Input
          isRequired
          errorMessage={errors.confirmPassword}
          label="Confirmar Contraseña"
          labelPlacement="outside"
          name="confirmPassword"
          placeholder="********"
          type="password"
        />
        <div className="flex justify-end">
          <Button color="primary" type="submit" isDisabled={submitting}>
            {submitting ? "Enviando" : "Enviar"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default RegisterPage;
