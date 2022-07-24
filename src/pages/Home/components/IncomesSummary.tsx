import { Stack, Img, Text } from "@chakra-ui/react";
import React from "react";
import moneyFormatter from "src/utils/moneyFormatter";
import ArrowDownIcon from "/Icons/arrow-down.svg";

interface Props {
  totalIncomes: number;
}

export const IncomesSummary: React.FC<Props> = ({ totalIncomes }) => {
  return (
    <Stack align="center" justify="center" spacing={0} width="50%">
      <Text variant="h4">Ingresos</Text>
      <Stack align="center" direction="row" position="relative">
        <Img height="45px" position="absolute" right="100%" src={ArrowDownIcon} width="45px" />
        <Text variant="h2">{moneyFormatter(totalIncomes)}</Text>
      </Stack>
    </Stack>
  );
};
