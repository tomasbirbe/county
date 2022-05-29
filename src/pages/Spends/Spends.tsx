import React, { useState } from "react";
import {
  Container,
  Stack,
  Img,
  Text,
  Box,
  Button,
  Input,
  Select,
  Grid,
  GridItem,
} from "@chakra-ui/react";

import EditIcon from "/Icons/edit.svg";
import DeleteIcon from "/Icons/delete.svg";
import ArrowUp from "/Icons/arrow-up.svg";
import PlusIcon from "/Icons/plus.svg";

import moneyFormatter from "src/utils/moneyFormatter";
import { KindOfSpend, Spend } from "src/types";

import { useSpends } from "./hooks/useSpends";

export const Spends: React.FC = () => {
  const [kindOfSpend, setKindOfSpend] = useState<KindOfSpend>(KindOfSpend.NOINSTALLMENTS);
  const { spends, actions } = useSpends();
  const [currentSpend, setCurrentSpend] = useState<Spend | null>(null);

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as KindOfSpend;

    setKindOfSpend(value);
  }

  function addSpend(event: React.FormEvent) {
    event.preventDefault();
    const {
      description,
      amount,
      kind_of_spend: kind,
      installments,
    } = event.target as HTMLFormElement;

    const newSpend = {
      id: (Math.random() * new Date().getTime()).toString(),
      description: description.value,
      kind: kind.value,
      amount: amount.value,
      installments: installments?.value ? installments.value : "",
    };

    actions.addSpend(newSpend);

    description.value = "";
    amount.value = "";
    kind.value = KindOfSpend.NOINSTALLMENTS;
    if (installments?.value) {
      installments.value = "";
    }
  }

  function modifySpend(spend: Spend) {
    actions.addSpend(currentSpend);
  }

  function handleNewDescription(e: any) {
    setCurrentSpend({ ...currentSpend, description: e.target.value });
  }
  function handleNewAmount(e: any) {
    setCurrentSpend({ ...currentSpend, amount: e.target.value });
  }

  function selectSpend(spend: Spend) {
    setCurrentSpend(spend);
  }

  function cancelModify() {
    setCurrentSpend(null);
  }

  function totalSpends() {
    return spends.reduce((acc, spend) => acc + Number(spend.amount), 0);
  }

  return (
    <Container maxWidth="full" paddingBlockStart={6} paddingX={0}>
      <Stack align="center" spacing={6}>
        <Stack align="center" spacing={0}>
          <Img height="50px" src={ArrowUp} width="50px" />
          <Text variant="h1/2">{moneyFormatter(totalSpends())}</Text>
        </Stack>
        <Box bg="spend" height="1px" width="40%" />
      </Stack>

      <Box marginInline="auto" paddingBlockStart={8} width="80%">
        <Stack as="form" marginInlineStart={6} paddingBlock={10} onSubmit={addSpend}>
          <Stack align="flex-start" direction="row" justify="space-around">
            <Stack as="label" htmlFor="description" spacing={5}>
              <Text>Descripcion</Text>
              <Input autoFocus required name="description" placeholder="Notebook" width="400px" />
            </Stack>
            <Stack as="label" htmlFor="amount" spacing={5}>
              <Text>Gasto</Text>
              <Input
                required
                marginBlockStart={4}
                min={1}
                name="amount"
                placeholder="$50000"
                step="any"
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
                  required
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
            <Button alignSelf="flex-end" type="submit" variant="add">
              <Img height="20px" marginInlineEnd={2} src={PlusIcon} width="20px" />{" "}
              <Text>Agregar gasto</Text>
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={0}>
          <Grid
            borderBlockEnd="1px solid"
            borderColor="primary.600"
            marginBlockEnd={2}
            paddingBlockEnd={2}
            paddingInline={2}
            templateColumns="6fr 3fr 1fr 0.5fr 0.5fr"
          >
            <GridItem color="gray.500" fontWeight="600">
              Descripcion
            </GridItem>
            <GridItem color="gray.500" fontWeight="600" textAlign="center">
              Gasto
            </GridItem>
            <GridItem color="gray.500" fontWeight="600" textAlign="center">
              Cuota
            </GridItem>
          </Grid>
          {spends.map((spend) => (
            <Grid
              key={spend.id}
              _hover={{ bg: "primary.700" }}
              alignItems="center"
              as="form"
              borderBlockEnd="1px solid black"
              borderColor="primary.600"
              borderRadius="15px"
              className="tableRow"
              paddingBlock={4}
              paddingInline={2}
              templateColumns="6fr 3fr 1fr 0.5fr 0.5fr"
            >
              {currentSpend && currentSpend.id === spend.id ? (
                <>
                  <GridItem>
                    <Input
                      required
                      placeholder={spend.description}
                      width="70%"
                      onChange={handleNewDescription}
                    />
                  </GridItem>
                  <GridItem textAlign="center">
                    <Input required placeholder={spend.amount} onChange={handleNewAmount} />
                  </GridItem>
                  <GridItem textAlign="center">
                    {spend?.installments ? spend.installments : "-"}
                  </GridItem>
                  <GridItem>
                    <Button type="button" onClick={modifySpend}>
                      Modificar
                    </Button>
                  </GridItem>
                  <GridItem>
                    <Button type="button" onClick={cancelModify}>
                      Cancelar
                    </Button>
                  </GridItem>
                </>
              ) : (
                <>
                  <GridItem>{spend.description}</GridItem>
                  <GridItem textAlign="center">{moneyFormatter(spend.amount)}</GridItem>
                  <GridItem textAlign="center">
                    {spend?.installments ? spend.installments : "-"}
                  </GridItem>
                  <GridItem className="editButton" justifySelf="center">
                    <Button variant="icon" onClick={() => selectSpend(spend)}>
                      <Img height="25px" src={EditIcon} width="25px" />
                    </Button>
                  </GridItem>
                  <GridItem className="deleteButton" justifySelf="center">
                    <Button variant="icon">
                      <Img height="25px" src={DeleteIcon} width="25px" />
                    </Button>
                  </GridItem>
                </>
              )}
            </Grid>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};
