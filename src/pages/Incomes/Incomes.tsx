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
  Button,
  Input,
} from "@chakra-ui/react";

import ArrowDown from "/Icons/arrow-down.svg";
import PlusIcon from "/Icons/plus.svg";

export const Incomes: React.FC = () => {
  return (
    <Container maxWidth="full" paddingBlockStart={6} paddingX={0}>
      <Stack align="center" spacing={6}>
        <Stack align="center" spacing={0}>
          <Img height="50px" src={ArrowDown} width="50px" />
          <Text variant="h1/2">$50000</Text>
        </Stack>
        <Box bg="income" height="1px" width="40%" />
      </Stack>
      <Box marginInline="auto" paddingBlockStart={8} width="80%">
        <Stack marginInline="auto" paddingBlock={10} width="70%">
          <Stack align="flex-start" direction="row" justify="space-around">
            <Stack as="label" htmlFor="description" spacing={5}>
              <Text>Descripcion</Text>
              <Input autoFocus name="description" placeholder="Notebook" width="400px" />
            </Stack>
            <Stack as="label" htmlFor="income" spacing={5}>
              <Text>Ingreso</Text>
              <Input
                marginBlockStart={4}
                name="income"
                placeholder="$50000"
                type="number"
                width="100px"
              />
            </Stack>

            <Button alignSelf="flex-end" type="button" variant="add">
              <Img height="20px" marginInlineEnd={2} src={PlusIcon} width="20px" />{" "}
              <Text>Agregar ingreso</Text>
            </Button>
          </Stack>
        </Stack>

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th width="80%">Descripcion</Th>
                <Th width="20%">Ingreso</Th>
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
