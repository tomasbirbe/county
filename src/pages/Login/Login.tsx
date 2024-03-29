import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/context/authContext";
import { PuffLoader } from "react-spinners";
import { Alert } from "src/components/Alert";
// Chakra ui

import { Box, Button, Container, Input, Link, Stack, Text } from "@chakra-ui/react";
import { Link as LinkRouter } from "react-router-dom";

// Firebase

import { auth } from "src/firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";

export const Login: React.FC = () => {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  function logIn(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setEmailError(false);
    setPasswordError(false);
    setIsLoading(true);
    const { emailInput, passwordInput } = event.target as HTMLFormElement;

    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
      .then((userCredentials) => {
        setIsLoading(false);
        setUser(userCredentials.user);
        navigate("/");
      })
      .catch((error) => {
        setIsLoading(false);
        const msg = error.message as string;

        if (msg.includes("invalid-email") || msg.includes("user-not-found")) {
          setEmailError(true);
          setErrorMessage("El correo electronico es incorrecto");
        }

        if (msg.includes("wrong-password")) {
          setPasswordError(true);
          setErrorMessage("La contraseña es incorrecta");
        }

        if (msg.includes("too-many-request")) {
          setIsAlertOpen(true);
          setErrorMessage(
            "La cuenta a la que estas intentado acceder fue bloqueada temporalmente por la cantidad de intentos de acceso fallidos",
          );
        }
      });
  }

  function closeAlert() {
    setIsAlertOpen(false);
  }

  function goToRegister() {
    navigate("/register");
  }

  return (
    <Container centerContent height="full" maxWidth="full" paddingBlockStart={20} paddingX={0}>
      <Text alignSelf="center" marginBlockEnd={8} variant="h1/2">
        County
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
          <Text>Email</Text>
          <Input
            required
            id="emailInput"
            minLength={3}
            placeholder="county@gmail.com"
            type="email"
            variant={emailError ? "invalid" : "base"}
          />
          {emailError && (
            <Text color="red.600" fontSize={14} lineHeight={1}>
              {errorMessage}
            </Text>
          )}
        </Stack>
        <Stack as="label" htmlFor="passwordInput">
          <Text>Password</Text>
          <Input
            required
            id="passwordInput"
            minLength={6}
            placeholder="Ingresa tu clave"
            type="password"
            variant={passwordError ? "invalid" : "base"}
          />
          {passwordError && (
            <Text color="red.600" fontSize={14} lineHeight={1}>
              {errorMessage}
            </Text>
          )}
        </Stack>
        <Stack spacing={2}>
          <Button type="submit" variant="primary">
            {isLoading ? <PuffLoader color="white" size={70} /> : "Entrar"}
          </Button>
          <Button cursor="pointer" variant="secondary" onClick={goToRegister}>
            <LinkRouter to="/register">Registrate!</LinkRouter>
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
            <Button
              _active={{ bg: "secondary.900" }}
              _focus={{}}
              _hover={{ bg: "secondary.500" }}
              bg="secondary.300"
              type="button"
              variant="primary"
              onClick={closeAlert}
            >
              Aceptar
            </Button>
          </Stack>
        </Alert>
      )}
    </Container>
  );
};
