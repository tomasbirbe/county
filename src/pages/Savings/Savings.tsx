import React, { useState } from "react";
import { Stack, Img, Text, Box, Button, Input, Grid, GridItem, chakra } from "@chakra-ui/react";

import SavingIcon from "/Icons/savings.svg";
import PlusIcon from "/Icons/plus.svg";
import DeleteIcon from "/Icons/delete.svg";

import moneyFormatter from "src/utils/moneyFormatter";

import { v4 } from "uuid";
import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useAuthContext } from "src/context/authContext";
import { app } from "src/firebase/app";
import { Saving, Period } from "src/types";
import { isValidMotionProp, motion } from "framer-motion";
import dayjs from "dayjs";
import { FormModal } from "src/components/Modal";

const db = getFirestore(app);

interface Props {
  setCurrentPeriod: React.Dispatch<React.SetStateAction<Period | null>>;
  currentPeriod: Period | null;
}

const Container = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

export const Savings: React.FC<Props> = ({ setCurrentPeriod, currentPeriod }) => {
  const { user } = useAuthContext();
  const [showForm, setShowForm] = useState(false);

  function addSaving(event: React.FormEvent) {
    event.preventDefault();
    const { description, amount } = event.target as HTMLFormElement;
    const newSaving: Saving = {
      id: v4(),
      description: description.value,
      amount: amount.value,
      created_at: dayjs().format("YYYY/MM/DD hh:mm:ss"),
    };

    if (user?.email && currentPeriod) {
      updateDoc(doc(db, "users", user.email, "countyData", currentPeriod.id), {
        savings: arrayUnion(newSaving),
      });

      setCurrentPeriod((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            savings: [...prevState.savings, newSaving],
          };
        }

        return null;
      });
    }

    description.value = "";
    amount.value = "";

    setShowForm(false);
  }

  function deleteSaving(saving: Saving) {
    if (user?.email && currentPeriod) {
      updateDoc(doc(db, "users", user.email, "countyData", currentPeriod.id), {
        savings: arrayRemove(saving),
      });
      if (currentPeriod) {
        setCurrentPeriod((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              savings: prevState.savings.filter((savingItem) => savingItem.id !== saving.id),
            };
          }

          return null;
        });
      }
    }
  }

  function calculateTotal() {
    if (currentPeriod) {
      return currentPeriod.savings.reduce(
        (acc: number, saving: Saving) => acc + Number(saving.amount),
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
      key={currentPeriod?.id}
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: "10px", opacity: 0 }}
      maxWidth="full"
      paddingBlockStart={6}
      paddingX={0}
      transition={{ ease: "easeInOut" }}
    >
      <Stack align="center" spacing={6}>
        <Stack align="center" spacing={0}>
          <Img height="50px" src={SavingIcon} width="50px" />
          <Text variant="h1/2">{moneyFormatter(calculateTotal())}</Text>
        </Stack>
        <Box bg="saving" height="1px" width="40%" />
      </Stack>

      <Box marginInline="auto" paddingBlockStart={8} width="80%">
        <Stack align="center">
          <Button
            _active={{ bg: "secondary.900" }}
            _hover={{ bg: "secondary.500" }}
            bg="secondary.300"
            marginBlockEnd={10}
            type="submit"
            variant="add"
            onClick={openForm}
          >
            <Img height="20px" marginInlineEnd={2} src={PlusIcon} width="20px" />{" "}
            <Text color="white">Nuevo ahorro </Text>
          </Button>
          {showForm && (
            <FormModal title="Agrega un nuevo ahorro!" onClose={closeForm}>
              <Stack as="form" spacing={8} onSubmit={addSaving}>
                <Stack as="label" htmlFor="description" spacing={2}>
                  <Text>Descripcion</Text>
                  <Input autoFocus name="description" placeholder="Notebook" width="280px" />
                </Stack>
                <Stack as="label" htmlFor="amount" spacing={2}>
                  <Text>Ahorro</Text>
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

        {currentPeriod?.savings.length ? (
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
            {currentPeriod?.savings.map((saving: Saving) => (
              <Grid
                key={saving.id}
                _hover={{ bg: "primary.700" }}
                alignItems="center"
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
        ) : (
          <Stack align="center" paddingBlockStart={6} width="full">
            <Text>Todavia no tenes ningun ahorro. Probá crear uno nuevo!</Text>
          </Stack>
        )}
      </Box>
    </Container>
  );
};
