import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/context/authContext";
import { PuffLoader } from "react-spinners";
import { Alert } from "src/components/Alert";
// Chakra ui

import { Button, Container, Input, Stack, Text } from "@chakra-ui/react";

// Firebase

import { auth } from "src/firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const Register: React.FC = () => {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  function logIn(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setEmailError(false);
    setPasswordError(false);
    setIsLoading(true);
    const { emailInput, passwordInput } = event.target as HTMLFormElement;

    createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
      .then((userCredentials) => {
        setIsLoading(false);
        setUser(userCredentials.user);
        navigate("/");
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        const msg = error.message as string;

        if (msg.includes("invalid-email")) {
          setEmailError(true);
          setErrorMessage("El correo electronico es invalido");
        }

        if (msg.includes("email-already-in-use")) {
          setEmailError(true);
          setErrorMessage("El correo electronico es invalido");
        }
      });
  }

  function closeAlert() {
    setIsAlertOpen(false);
  }

  return (
    <Container centerContent height="full" maxWidth="full" paddingBlockStart={20} paddingX={0}>
      <Text alignSelf="center" marginBlockEnd={8} variant="h1/2">
        Únete!
      </Text>
      <Stack
        as="form"
        height="full"
        justify="flex-start"
        spacing={6}
        width="300px"
        onSubmit={logIn}
      >
        <Stack as="label" htmlFor="emailInput" spacing={2}>
          <Text>Correo electronico</Text>
          <Input
            id="emailInput"
            minLength={3}
            placeholder="county@gmail.com"
            // type="email"
            variant={emailError ? "invalid" : "base"}
          />
          {emailError && (
            <Text color="red.600" fontSize={14} lineHeight={1}>
              {errorMessage}
            </Text>
          )}
        </Stack>
        <Stack as="label" htmlFor="passwordInput">
          <Text>Clave</Text>
          <Input
            id="passwordInput"
            minLength={6}
            placeholder="*******"
            type="password"
            variant={passwordError ? "invalid" : "base"}
          />
          {passwordError && (
            <Text color="red.600" fontSize={14} lineHeight={1}>
              {errorMessage}
            </Text>
          )}
        </Stack>
        <Stack as="label" htmlFor="passwordConfirmInput">
          <Text>Confirmar clave</Text>
          <Input
            id="passwordConfirmInput"
            minLength={6}
            placeholder="*******"
            type="password"
            variant={passwordConfirmError ? "invalid" : "base"}
          />
          {passwordConfirmError && (
            <Text color="red.600" fontSize={14} lineHeight={1}>
              {errorMessage}
            </Text>
          )}
        </Stack>
        <Stack spacing={2}>
          <Button type="submit" variant="primary">
            {isLoading ? <PuffLoader color="white" size={70} /> : "Crear cuenta!"}
          </Button>
          <Button type="button" variant="secondary">
            Volver
          </Button>
        </Stack>
      </Stack>
      {isAlertOpen && (
        <Alert onClose={closeAlert}>
          <Stack
            height="full"
            justify="space-between"
            paddingBlockEnd={4}
            paddingBlockStart={2}
            paddingInline={6}
          >
            <Text>
              La cuenta a la que estas intentado acceder fue bloqueada temporalmente debido a varios
              intentos fallidos
            </Text>
            <Text> Volve a intentarlo mas tarde</Text>
            <Button type="button" variant="primary" onClick={closeAlert}>
              Aceptar
            </Button>
          </Stack>
        </Alert>
      )}
    </Container>
  );
};
