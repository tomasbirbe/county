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
  Select,
} from "@chakra-ui/react";

import ArrowUp from "/Icons/arrow-up.svg";
import PlusIcon from "/Icons/plus.svg";

export const Spends: React.FC = () => {
  return (
    <Container maxWidth="full" paddingBlockStart={6} paddingX={0}>
      <Stack align="center" spacing={6}>
        <Stack align="center" spacing={0}>
          <Img height="50px" src={ArrowUp} width="50px" />
          <Text variant="h1/2">$50000</Text>
        </Stack>
        <Box bg="spend" height="1px" width="40%" />
      </Stack>

      <Box marginInline="auto" paddingBlockStart={8} width="80%">
        <Button marginBlockEnd={4} marginInlineStart={6} type="button" variant="add">
          <Img height="20px" marginInlineEnd={2} src={PlusIcon} width="20px" />
          <Text>Agregar gasto</Text>
        </Button>
        <Stack marginInlineStart={6} paddingInline={6} spacing={6}>
          <Stack direction="row" spacing={12}>
            <label htmlFor="">
              <Text>Descripcion</Text>
              <Input placeholder="Notebook" width="400px" />
            </label>
            <label htmlFor="">
              <Text>Gasto</Text>
              <Input placeholder="$50000" type="number" width="100px" />
            </label>
          </Stack>
          <Stack direction="row" spacing={12}>
            <label htmlFor="">
              <Text>Tipo de compra</Text>
              <Select width="200px">
                <option value="">Efectivo / Debito</option>
                <option value="">Credito</option>
                <option value="">Recurrente</option>
              </Select>
            </label>
            <label htmlFor="">
              <Text>Cuotas</Text>
              <Input
                max={99}
                min={1}
                placeholder="1"
                textAlign="center"
                type="number"
                width="30px"
              />
            </label>
          </Stack>
        </Stack>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th width="60%">Descripcion</Th>
                <Th width="30%">Gasto</Th>
                <Th width="10%">Cuota</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Celu Cati</Td>
                <Td>$50000</Td>
                <Td>1/2</Td>
              </Tr>
              <Tr>
                <Td>Celu Cati</Td>
                <Td>$50000</Td>
                <Td>1/2</Td>
              </Tr>
              <Tr>
                <Td>Celu Cati</Td>
                <Td>$50000</Td>
                <Td>1/2</Td>
              </Tr>
              <Tr>
                <Td>Celu Cati</Td>
                <Td>$50000</Td>
                <Td>1/2</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};
