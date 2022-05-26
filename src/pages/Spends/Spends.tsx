import React from "react";
import { Container, Stack, Img, Text, Box, Divider } from "@chakra-ui/react";

import ArrowUp from "/Icons/arrow-up.svg";

export const Spends: React.FC = () => {
  return (
    <Container height="full" maxWidth="full" paddingBlockStart={6} paddingX={0}>
      <Stack align="center" spacing={6}>
        <Stack align="center" spacing={0}>
          <Img height="50px" src={ArrowUp} width="50px" />
          <Text variant="h1/2">$50000</Text>
        </Stack>
        <Box bg="spend" height="1px" width="40%" />
      </Stack>
      
    </Container>
  );
};
