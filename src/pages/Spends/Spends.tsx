import React, { useState } from "react";
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

enum KindOfSpend {
  NOINSTALLMENTS = "NOINSTALLMENTS",
  INSTALLMENTS = "INSTALLMENTS",
  RECURRENT = "RECURRENT",
}

export const Spends: React.FC = () => {
  const [kindOfSpend, setKindOfSpend] = useState<KindOfSpend>(KindOfSpend.NOINSTALLMENTS);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as KindOfSpend;

    setKindOfSpend(value);
  }

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
        <Stack marginInlineStart={6} paddingBlock={10}>
          <Stack align="flex-start" direction="row" justify="space-around">
            <Stack as="label" htmlFor="description" spacing={5}>
              <Text>Descripcion</Text>
              <Input autoFocus name="description" placeholder="Notebook" width="400px" />
            </Stack>
            <Stack as="label" htmlFor="spend" spacing={5}>
              <Text>Gasto</Text>
              <Input
                marginBlockStart={4}
                name="spend"
                placeholder="$50000"
                type="number"
                width="100px"
              />
            </Stack>
            <Stack as="label" htmlFor="kind_of_spend">
              <Text>Tipo de compra</Text>
              <Select
                border="1px solid"
                borderColor="primary.900"
                name="kind_of_spend"
                width="200px"
                onChange={handleSelect}
              >
                <option value={KindOfSpend.NOINSTALLMENTS}>Efectivo / Debito</option>
                <option value={KindOfSpend.INSTALLMENTS}>Credito</option>
                <option value={KindOfSpend.RECURRENT}>Recurrente</option>
              </Select>
            </Stack>
            {kindOfSpend === KindOfSpend.INSTALLMENTS && (
              <Stack align="center" as="label" htmlFor="installments" spacing={5}>
                <Text>Cuotas</Text>
                <Input
                  marginBlockStart={4}
                  max={99}
                  min={1}
                  name="installments"
                  placeholder="1"
                  textAlign="center"
                  type="number"
                  width="30px"
                />
              </Stack>
            )}
            <Button alignSelf="flex-end" type="button" variant="add">
              <Img height="20px" marginInlineEnd={2} src={PlusIcon} width="20px" />{" "}
              <Text>Agregar gasto</Text>
            </Button>
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
