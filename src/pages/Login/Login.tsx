import { Box, Button, Container, Input, Link, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthContext } from "src/context/authContext";
import { signIn } from "src/auth";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const { auth, setAuth } = useAuthContext();
  const navigate = useNavigate();

  function logIn(event: React.FormEvent) {
    event.preventDefault();
    const { email, password } = event.target as HTMLFormElement;

    signIn(email.value, password.value)
      .then((uid) => {
        setAuth(uid);
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
        <Stack as="label">
          <Text>Email</Text>
          <Input name="email" placeholder="tomasespinosa9898@gmail.com" />
        </Stack>
        <Stack as="label">
          <Text>Password</Text>
          <Input name="password" placeholder="***" type="password" />
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
