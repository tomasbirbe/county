import React from "react";
import {
  Container,
  Stack,
  Img,
  Text,
  Box,
  Table,
  TableContainer,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
} from "@chakra-ui/react";

import SavingIcon from "/Icons/savings.svg";

export const Savings: React.FC = () => {
  return (
    <Container maxWidth="full" paddingBlockStart={6} paddingX={0}>
      <Stack align="center" spacing={6}>
        <Stack align="center" spacing={0}>
          <Img height="50px" src={SavingIcon} width="50px" />
          <Text variant="h1/2">$50000</Text>
        </Stack>
        <Box bg="saving" height="1px" width="40%" />
      </Stack>
      <Box marginInline="auto" paddingBlockStart={8} width="80%">
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th width="80%">Descripcion</Th>
                <Th width="20%">Ahorro</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Celu Cati</Td>
                <Td>$50000</Td>
              </Tr>
              <Tr>
                <Td>Celu Cati</Td>
                <Td>$50000</Td>
              </Tr>
              <Tr>
                <Td>Celu Cati</Td>
                <Td>$50000</Td>
              </Tr>
              <Tr>
                <Td>Celu Cati</Td>
                <Td>$50000</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};
