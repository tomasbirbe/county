import React from "react";
import { Container, Icon, Img, Stack, Text } from "@chakra-ui/react";

import arrowUp from "/Icons/arrow-up.svg";

import Savings from "./Components/UI/Savings";
import Spends from "./Components/UI/Spends";
import Overview from "./Components/UI/Overview";
import Incomes from "./Components/UI/Incomes";

export const Home: React.FC = () => {
  return (
    <Container as="main" height="calc(100% - 36px)" maxWidth="full" paddingX={0}>
      <Overview as="section" height="100%">
        <Spends as="article" height="100%">
          <Stack align="center" height="100%" justify="center" spacing={0}>
            <Text variant="h3">Gastos</Text>
            <Stack align="center" direction="row">
              <Img height="75px" src={arrowUp} width="75px" />
              <Text variant="h1">$50000</Text>
            </Stack>
          </Stack>
        </Spends>
        <Savings as="article" height="100%">
          <Stack align="center" height="100%" justify="center">
            <Text>Hola</Text>
          </Stack>
        </Savings>
        <Incomes as="article" height="100%">
          <Stack align="center" height="100%" justify="center">
            <Text>Hola</Text>
          </Stack>
        </Incomes>
      </Overview>
    </Container>
  );
};
