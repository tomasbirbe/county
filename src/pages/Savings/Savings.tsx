import React from "react";
import { Container, Stack, Img, Text, Box, Button, Input, Grid, GridItem } from "@chakra-ui/react";

import SavingIcon from "/Icons/savings.svg";
import PlusIcon from "/Icons/plus.svg";
import DeleteIcon from "/Icons/delete.svg";

import moneyFormatter from "src/utils/moneyFormatter";

import { v4 } from "uuid";
import dayjs from "dayjs";
import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useAuthContext } from "src/context/authContext";
import { app } from "src/firebase/app";
import { Saving } from "src/types";

const db = getFirestore(app);

interface Props {
  savings: Saving[];
  setSavings: React.Dispatch<React.SetStateAction<Saving[]>>;
  date: string;
}

export const Savings: React.FC<Props> = ({ savings, setSavings, date }) => {
  const { user } = useAuthContext();

  function addSaving(event: React.FormEvent) {
    event.preventDefault();
    const { description, amount } = event.target as HTMLFormElement;
    const newSaving: Saving = {
      id: v4(),
      description: description.value,
      amount: amount.value,
    };

    if (user?.email) {
      updateDoc(doc(db, "users", user.email, "countyData", date), {
        savings: arrayUnion(newSaving),
      });
      setSavings((prevState: Saving[]) => [...prevState, newSaving]);
    }

    description.value = "";
    amount.value = "";
  }

  function deleteSaving(saving: Saving) {
    if (user?.email) {
      updateDoc(doc(db, "users", user.email, "countyData", date), {
        savings: arrayRemove(saving),
      });
      setSavings(savings.filter((savingItem) => savingItem.id !== saving.id));
    }
  }

  function calculateTotal() {
    return savings.reduce((acc, saving) => acc + Number(saving.amount), 0);
  }

  return (
    <Container maxWidth="full" paddingBlockStart={6} paddingX={0}>
      <Stack align="center" spacing={6}>
        <Stack align="center" spacing={0}>
          <Img height="50px" src={SavingIcon} width="50px" />
          <Text variant="h1/2">{moneyFormatter(calculateTotal())}</Text>
        </Stack>
        <Box bg="saving" height="1px" width="40%" />
      </Stack>

      <Box marginInline="auto" paddingBlockStart={8} width="80%">
        <Stack marginInline="auto" paddingBlock={10} width="70%">
          <Stack
            align="flex-start"
            as="form"
            direction="row"
            justify="space-around"
            onSubmit={addSaving}
          >
            <Stack as="label" htmlFor="description" spacing={5}>
              <Text>Descripcion</Text>
              <Input autoFocus name="description" placeholder="Notebook" width="400px" />
            </Stack>
            <Stack as="label" htmlFor="amount" spacing={5}>
              <Text>Ahorro</Text>
              <Stack direction="row" spacing={1}>
                <Text>$</Text>
                <Input
                  marginBlockStart={4}
                  name="amount"
                  placeholder="50000"
                  type="number"
                  width="70px"
                />
              </Stack>
            </Stack>

            <Button alignSelf="flex-end" type="submit" variant="add">
              <Img height="20px" marginInlineEnd={2} src={PlusIcon} width="20px" />
              <Text>Agregar ahorro</Text>
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
          {savings.map((saving) => (
            <Grid
              key={saving.id}
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
                <GridItem>{saving.description}</GridItem>
                <GridItem textAlign="center">{moneyFormatter(saving.amount)}</GridItem>
                <GridItem className="deleteButton" justifySelf="center">
                  <Button variant="icon" onClick={() => deleteSaving(saving)}>
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
