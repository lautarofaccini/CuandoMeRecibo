"use client";
import React, { useState } from "react";
import { Form, Input, Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginPage() {
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const newErrors = {};

    if (!data.email) newErrors.email = "Correo requerido";
    if (!data.password) newErrors.password = "Contraseña requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
    setSubmitting(false);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <Form
        className="w-1/4 flex flex-col gap-4"
        validationErrors={errors}
        onSubmit={onSubmit}
      >
        {errorMessage && (
          <p className="bg-red-500 text-lg text-white p-3 rounded ">
            {errorMessage}
          </p>
        )}
        <h1 className="text-slate-200 font-bold text-3xl mb-4">
          Iniciar Sesión
        </h1>
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
        <div className="flex justify-end">
          <Button color="primary" type="submit" isDisabled={submitting}>
            {submitting ? "Enviando" : "Enviar"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;
