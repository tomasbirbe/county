import React from "react";
import { Stack, Img, Text, Box, Button, Input, Grid, GridItem, chakra } from "@chakra-ui/react";
import moneyFormatter from "src/utils/moneyFormatter";

import ArrowDown from "/Icons/arrow-down.svg";
import PlusIcon from "/Icons/plus.svg";
import DeleteIcon from "/Icons/delete.svg";
import { Income, Period } from "src/types";
import { v4 } from "uuid";
import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useAuthContext } from "src/context/authContext";

import { app } from "src/firebase/app";
import dayjs from "dayjs";
import { isValidMotionProp, motion } from "framer-motion";
interface Props {
  setCurrentPeriod: React.Dispatch<React.SetStateAction<Period | null>>;
  currentPeriod: Period | null;
}

const Container = chakra(motion.main, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

const db = getFirestore(app);

export const Incomes: React.FC<Props> = ({ setCurrentPeriod, currentPeriod }) => {
  const { user } = useAuthContext();

  function addIncome(event: React.FormEvent) {
    event.preventDefault();
    const { description, amount } = event.target as HTMLFormElement;

    const newIncome: Income = {
      id: v4(),
      description: description.value,
      amount: amount.value,
      created_at: dayjs().format("YYYY/MM/DD hh:mm:ss"),
    };

    if (user?.email && currentPeriod) {
      updateDoc(doc(db, "users", user.email, "countyData", currentPeriod.id), {
        incomes: arrayUnion(newIncome),
      });
      setCurrentPeriod((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            incomes: [...prevState.incomes, newIncome],
          };
        }

        return null;
      });
    }

    description.value = "";
    amount.value = "";
  }

  function deleteIncome(income: Income) {
    if (user?.email && currentPeriod) {
      updateDoc(doc(db, "users", user.email, "countyData", currentPeriod.id), {
        incomes: arrayRemove(income),
      });

      setCurrentPeriod((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            incomes: prevState.incomes.filter((incomeItem) => incomeItem.id !== income.id),
          };
        }

        return null;
      });
    }
  }

  function calculateTotal() {
    if (currentPeriod) {
      return currentPeriod.incomes.reduce(
        (acc: number, income: Income) => acc + Number(income.amount),
        0,
      );
    }

    return 0;
  }

  return (
    <Container
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
      <Box marginInline="auto" paddingBlockStart={8} width="80%">
        <Stack marginInline="auto" paddingBlock={10} width="70%">
          <Stack
            align="flex-start"
            as="form"
            direction="row"
            justify="space-around"
            onSubmit={addIncome}
          >
            <Stack as="label" htmlFor="description" spacing={2}>
              <Text>Descripcion</Text>
              <Input autoFocus name="description" placeholder="Notebook" width="400px" />
            </Stack>
            <Stack as="label" htmlFor="amount" spacing={2}>
              <Text>Ingreso</Text>
              <Input
                marginBlockStart={4}
                name="amount"
                placeholder="50000"
                type="number"
                width="70px"
              />
            </Stack>

            <Button alignSelf="flex-end" type="submit" variant="add">
              <Img height="20px" marginInlineEnd={2} src={PlusIcon} width="20px" />
              <Text>Agregar ingreso</Text>
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
            templateColumns="7fr 2fr 1fr"
          >
            <GridItem color="gray.500" fontWeight="600">
              Descripcion
            </GridItem>
            <GridItem color="gray.500" fontWeight="600" textAlign="center">
              Gasto
            </GridItem>
          </Grid>
          {currentPeriod?.incomes.map((income: Income) => (
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
      </Box>
    </Container>
  );
};
