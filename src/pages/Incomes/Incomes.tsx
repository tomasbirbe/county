import React, { useState } from "react";
import { Stack, Img, Text, Box, Button, Input, Grid, GridItem, chakra } from "@chakra-ui/react";
import moneyFormatter from "src/utils/moneyFormatter";

import ArrowDown from "/Icons/arrow-down.svg";
import PlusIcon from "/Icons/plus.svg";
import DeleteIcon from "/Icons/delete.svg";
import { Income, Sheet } from "src/types";

import { isValidMotionProp, motion } from "framer-motion";
import { FormModal } from "src/components/Modal";
interface Props {
  currentSheet: Sheet | null;
  addIncome: (arg01: string, arg02: string) => void;
  deleteIncome: (arg01: Income) => void;
}

const Container = chakra(motion.main, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

export const Incomes: React.FC<Props> = ({ currentSheet, addIncome, deleteIncome }) => {
  const [showForm, setShowForm] = useState(false);

  function createNewIncome(event: React.FormEvent) {
    event.preventDefault();
    const { description, amount } = event.target as HTMLFormElement;

    addIncome(description.value, amount.value);

    description.value = "";
    amount.value = "";
    setShowForm(false);
  }

  function calculateTotal() {
    if (currentSheet) {
      return currentSheet.incomes.reduce(
        (acc: number, income: Income) => acc + Number(income.amount),
        0,
      );
    }

    return 0;
  }

  function openForm() {
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
  }

  return (
    <Container
      key={currentSheet?.id}
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: "10px", opacity: 0 }}
      maxWidth="full"
      paddingBlockStart={6}
      paddingX={0}
      transition={{ ease: "easeInOut" }}
    >
      <Stack align="center" spacing={6}>
        <Stack align="center" spacing={0}>
          <Img height="50px" src={ArrowDown} width="50px" />
          <Text variant="h1/2">{moneyFormatter(calculateTotal())}</Text>
        </Stack>
        <Box bg="income" height="1px" width="40%" />
      </Stack>

      <Stack align="center" justify="center" paddingBlock={6} position="sticky" top="-5px">
        <Button
          _active={{ bg: "secondary.900" }}
          _hover={{ bg: "secondary.500" }}
          bg="secondary.300"
          type="submit"
          onClick={openForm}
        >
          <Img height="20px" marginInlineEnd={2} src={PlusIcon} width="20px" />{" "}
          <Text color="white">Nuevo ingreso </Text>
        </Button>
      </Stack>

      <Box marginInline="auto" paddingBlockStart={8} width="80%">
        <Stack align="center">
          {showForm && (
            <FormModal title="Agrega un nuevo ingreso!" onClose={closeForm}>
              <Stack as="form" spacing={8} onSubmit={createNewIncome}>
                <Stack as="label" htmlFor="description" spacing={2}>
                  <Text>Descripcion</Text>
                  <Input autoFocus name="description" placeholder="Notebook" width="280px" />
                </Stack>
                <Stack as="label" htmlFor="amount" spacing={2}>
                  <Text>Ingreso</Text>
                  <Input name="amount" placeholder="50000" type="number" width="200px" />
                </Stack>

                <Button
                  _active={{ bg: "secondary.900" }}
                  _focus={{}}
                  _hover={{ bg: "secondary.500" }}
                  bg="secondary.300"
                  color="white"
                  fontWeight="regular"
                  type="submit"
                >
                  Agregar
                </Button>
              </Stack>
            </FormModal>
          )}
        </Stack>
        {currentSheet?.incomes.length ? (
          <Stack spacing={0}>
            <Grid
              borderBlockEnd="1px solid"
              borderColor="primary.600"
              marginBlockEnd={2}
              paddingBlockEnd={2}
              paddingInline={2}
              templateColumns="7fr 2fr 1fr"
            >
              <GridItem color="gray.500" fontWeight="600">
                Descripcion
              </GridItem>
              <GridItem color="gray.500" fontWeight="600" textAlign="center">
                Gasto
              </GridItem>
            </Grid>
            {currentSheet?.incomes.map((income: Income) => (
              <Grid
                key={income.id}
                _hover={{ bg: "primary.700" }}
                alignItems="center"
                as="form"
                borderBlockEnd="1px solid black"
                borderColor="primary.600"
                borderRadius="15px"
                className="tableRow"
                paddingBlock={4}
                paddingInline={2}
                templateColumns="7fr 2fr 1fr "
              >
                <>
                  <GridItem>{income.description}</GridItem>
                  <GridItem textAlign="center">{moneyFormatter(income.amount)}</GridItem>
                  <GridItem className="deleteButton" justifySelf="center">
                    <Button variant="icon" onClick={() => deleteIncome(income)}>
                      <Img height="25px" src={DeleteIcon} width="25px" />
                    </Button>
                  </GridItem>
                </>
              </Grid>
            ))}
          </Stack>
        ) : (
          <Stack align="center" paddingBlockStart={6} width="full">
            <Text>Todavia no tenes ningun ingreso. Probá crear uno nuevo!</Text>
          </Stack>
        )}
      </Box>
    </Container>
  );
};
