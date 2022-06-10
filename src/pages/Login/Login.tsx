import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "src/context/authContext";

// Chakra ui

import { Box, Button, Container, Input, Link, Stack, Text } from "@chakra-ui/react";

// Firebase

import { app, auth } from "src/firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { createNewUser } from "src/firebase/db/User";

export const Login: React.FC = () => {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  function logIn(event: React.FormEvent) {
    event.preventDefault();
    const { emailInput, passwordInput } = event.target as HTMLFormElement;

    // createNewUser(emailInput.value, passwordInput.value);

    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
      .then((userCredentials) => {
        setUser(userCredentials.user);
        navigate("/");
      })
      .catch((error) => {
        throw new Error(error);
      });
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
        <Stack as="label" htmlFor="emailInput">
          <Text>Email</Text>
          <Input id="emailInput" placeholder="tomasespinosa9898@gmail.com" />
        </Stack>
        <Stack as="label" htmlFor="passwordInput">
          <Text>Password</Text>
          <Input id="passwordInput" placeholder="***" type="password" />
        </Stack>
        <Stack spacing={2}>
          <Button type="submit" variant="primary">
            Sign in
          </Button>
          <Button type="button" variant="secondary">
            Register
          </Button>

          <Box textAlign="center">
            <Text display="inline" fontSize={14}>
              Did you forget your password? Try with
            </Text>
            <Link color="blue.500" fontSize={14} paddingInlineStart={1}>
              Recovery your password
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};
