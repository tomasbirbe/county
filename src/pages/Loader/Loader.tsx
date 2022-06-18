import { Container, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { PuffLoader } from "react-spinners";

export const Loader: React.FC = () => {
  return (
    <Container height="full" maxW="full" padding={0}>
      <Stack align="center" height="full" justify="center" marginInline="auto" spacing={15}>
        <Text variant="h1/2">County</Text>
        <PuffLoader color="#2c2c2c" loading={true} size={60} />
      </Stack>
    </Container>
  );
};
