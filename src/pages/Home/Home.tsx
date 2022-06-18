import React from "react";
import { Box, Container, Img, Stack, Text } from "@chakra-ui/react";

import ArrowUpIcon from "/Icons/arrow-up.svg";
import SavingsIcon from "/Icons/savings.svg";
import ArrowDownIcon from "/Icons/arrow-down.svg";

import moneyFormatter from "src/utils/moneyFormatter";
import { useAuthContext } from "src/context/authContext";
import { Income, Saving, Spend } from "src/types";

interface Props {
  spends: Spend[];
  incomes: Income[];
  savings: Saving[];
}

export const Home: React.FC<Props> = ({ spends, incomes, savings }) => {
  function totalSpends() {
    return spends.reduce((acc: number, spend: Spend) => acc + Number(spend.amount), 0);
  }

  function totalSavings() {
    return savings.reduce((acc: number, saving: Saving) => acc + Number(saving.amount), 0);
  }

  function totalIncomes() {
    return incomes.reduce((acc: number, income: Income) => acc + Number(income.amount), 0);
  }

  return (
    <Container as="main" height="calc(100% - 71px)" maxWidth="full" paddingX={0}>
      <Stack as="header" height="full">
        <Stack align="center" as="article" height="40%" justify="center" spacing={0} width="full">
          <Text variant="h3">Gastos</Text>
          <Stack align="center" direction="row">
            <Img height="55px" src={ArrowUpIcon} width="55px" />
            <Text variant="h1">{moneyFormatter(totalSpends())}</Text>
          </Stack>
        </Stack>

        <Stack align="center" as="article" direction="row" height="50%">
          <Stack align="center" justify="center" spacing={0} width="50%">
            <Text variant="h4">Ahorros</Text>
            <Stack align="center" direction="row">
              <Img height="45px" src={SavingsIcon} width="45px" />
              <Text variant="h2">{moneyFormatter(totalSavings())}</Text>
            </Stack>
          </Stack>
          <Box bg="blackAlpha.300" height="60%" width="1px" />
          <Stack align="center" justify="center" spacing={0} width="50%">
            <Text variant="h4">Ingresos</Text>
            <Stack align="center" direction="row">
              <Img height="45px" src={ArrowDownIcon} width="45px" />
              <Text variant="h2">{moneyFormatter(totalIncomes())}</Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
