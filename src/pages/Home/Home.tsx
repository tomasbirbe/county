import React from "react";
import { Box, Container, Img, Stack, Text } from "@chakra-ui/react";

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
      <Stack as="section" height="full">
        <Stack align="center" as="article" height="40%" justify="center" spacing={0} width="full">
          <Text variant="h3">Gastos</Text>
          <Stack align="center" direction="row">
            <Img height="55px" src={ArrowUpIcon} width="55px" />
            <Text variant="h1">$50000</Text>
          </Stack>
        </Stack>

        <Stack align="center" as="article" direction="row" height="50%">
          <Stack align="center" justify="center" spacing={0} width="50%">
            <Text variant="h4">Ahorros</Text>
            <Stack align="center" direction="row">
              <Img height="45px" src={SavingsIcon} width="45px" />
              <Text variant="h2">$50000</Text>
            </Stack>
          </Stack>
          <Box bg="blackAlpha.300" height="60%" width="1px" />
          <Stack align="center" justify="center" spacing={0} width="50%">
            <Text variant="h4">Ingresos</Text>
            <Stack align="center" direction="row">
              <Img height="45px" src={ArrowDownIcon} width="45px" />
              <Text variant="h2">$50000</Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
