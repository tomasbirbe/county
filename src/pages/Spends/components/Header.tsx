import { Stack, Img, Box, Text } from "@chakra-ui/react";
import moneyFormatter from "src/utils/moneyFormatter";
import ArrowUp from "/Icons/arrow-up.svg";

interface Props {
  totalSpends: number;
}

export const Header: React.FC<Props> = ({ totalSpends }) => {
  return (
    <Stack align="center" spacing={6}>
      <Stack align="center" spacing={0}>
        <Img height="50px" src={ArrowUp} width="50px" />
        <Text variant="h1/2">{moneyFormatter(totalSpends)}</Text>
      </Stack>
      <Box bg="spend" height="1px" width="40%" />
    </Stack>
  );
};
