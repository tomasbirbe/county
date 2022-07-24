import { Stack, Img, Text } from "@chakra-ui/react";
import React from "react";
import moneyFormatter from "src/utils/moneyFormatter";
import SavingsIcon from "/Icons/savings.svg";

interface Props {
  totalSavings: number;
}

export const SavingsSummary: React.FC<Props> = ({ totalSavings }) => {
  return (
    <Stack align="center" justify="center" spacing={0} width="50%">
      <Text variant="h4">Ahorros</Text>
      <Stack align="center" direction="row" position="relative">
        <Img height="45px" position="absolute" right="100%" src={SavingsIcon} width="45px" />
        <Text variant="h2">{moneyFormatter(totalSavings)}</Text>
      </Stack>
    </Stack>
  );
};
