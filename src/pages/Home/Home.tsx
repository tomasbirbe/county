import React from "react";
import { Container, Img, Stack, Text } from "@chakra-ui/react";

import ArrowUpIcon from "/Icons/arrow-up.svg";
import SavingsIcon from "/Icons/savings.svg";
import ArrowDownIcon from "/Icons/arrow-down.svg";

import Savings from "./Components/UI/Savings";
import Spends from "./Components/UI/Spends";
import Overview from "./Components/UI/Overview";
import Incomes from "./Components/UI/Incomes";

export const Home: React.FC = () => {
  return (
    <Container as="main" height="calc(100% - 50px)" maxWidth="full" paddingX={0}>
      <Overview as="section" height="100%">
        <Spends as="article" height="90%">
          <Stack align="center" height="full" justify="center" spacing={0}>
            <Text variant="h3">Gastos</Text>
            <Stack align="center" direction="row">
              <Img height="55px" src={ArrowUpIcon} width="55px" />
              <Text variant="h1">$50000</Text>
            </Stack>
          </Stack>
        </Spends>
        <Savings as="article" height="70%">
          <Stack align="center" height="full" justify="center" spacing={0}>
            <Text variant="h4">Ahorros</Text>
            <Stack align="center" direction="row">
              <Img height="45px" src={SavingsIcon} width="45px" />
              <Text variant="h2">$50000</Text>
            </Stack>
          </Stack>
        </Savings>
        <Incomes as="article" height="70%">
          <Stack align="center" height="full" justify="center" spacing={0}>
            <Text variant="h4">Ingresos</Text>
            <Stack align="center" direction="row">
              <Img height="45px" src={ArrowDownIcon} width="45px" />
              <Text variant="h2">$50000</Text>
            </Stack>
          </Stack>
        </Incomes>
      </Overview>
    </Container>
  );
};
