import { Stack, Img, Text } from "@chakra-ui/react";
import React from "react";
import moneyFormatter from "src/utils/moneyFormatter";

import ArrowUpIcon from "/Icons/arrow-up.svg";

interface Props {
  totalSpends: number;
}

export const SpendsSummary: React.FC<Props> = ({ totalSpends }) => {
  return (
    <Stack align="center" as="article" height="40%" justify="center" spacing={0} width="full">
      <Text variant="h3">Gastos</Text>
      <Stack align="center" direction="row" position="relative">
        <Img height="55px" position="absolute" right="100%" src={ArrowUpIcon} width="55px" />
        <Text variant="h1">{moneyFormatter(totalSpends)}</Text>
      </Stack>
    </Stack>
  );
};
