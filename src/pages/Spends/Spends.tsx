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

import DeleteIcon from "/Icons/delete.svg";
import ArrowUp from "/Icons/arrow-up.svg";
import PlusIcon from "/Icons/plus.svg";

import moneyFormatter from "src/utils/moneyFormatter";
import { KindOfSpend, Spend, Period } from "src/types";

import { useAuthContext } from "src/context/authContext";
import { v4 } from "uuid";
import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "src/firebase/app";

const db = getFirestore(app);

interface Props {
  setCurrentPeriod: React.Dispatch<React.SetStateAction<Period | null>>;
  currentPeriod: Period | null;
}

export const Spends: React.FC<Props> = ({ setCurrentPeriod, currentPeriod }) => {
  const { user } = useAuthContext();
  const [kindOfSpend, setKindOfSpend] = useState<KindOfSpend>(KindOfSpend.NOINSTALLMENTS);

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
      id: v4(),
      description: description.value,
      amount: amount.value,
      kind: kind.value,
      installments: kind.value !== KindOfSpend.INSTALLMENTS ? "-" : installments?.value,
    };

    if (currentPeriod) {
      setCurrentPeriod((prevPeriod) => {
        if (prevPeriod) {
          return {
            ...prevPeriod,
            spends: [...prevPeriod.spends, newSpend],
          };
        }

        return null;
      });
      if (user?.email && currentPeriod) {
        updateDoc(doc(db, "users", user.email, "countyData", currentPeriod.id), {
          spends: arrayUnion(newSpend),
        });
      }
    }

    description.value = "";
    amount.value = "";
    kind.value = KindOfSpend.NOINSTALLMENTS;
    setKindOfSpend(KindOfSpend.NOINSTALLMENTS);
    if (installments?.value) {
      installments.value = "";
    }
  }

  function deleteSpend(spend: Spend) {
    if (user?.email && currentPeriod) {
      updateDoc(doc(db, "users", user.email, "countyData", currentPeriod.id), {
        spends: arrayRemove({ ...spend }),
      }).catch((error) => {
        throw new Error(error);
      });
      setCurrentPeriod((prevPeriod) => {
        if (prevPeriod) {
          return {
            ...prevPeriod,
            spends: prevPeriod.spends.filter((spendItem: Spend) => spendItem.id !== spend.id),
          };
        }

        return null;
      });
    }
  }

  function totalSpends() {
    if (currentPeriod) {
      return currentPeriod.spends.reduce(
        (acc: number, spend: Spend) => acc + Number(spend.amount),
        0,
      );
    }

    return 0;
  }

  function calculateInstallment(spend: Spend) {
    if (spend.kind === KindOfSpend.INSTALLMENTS) {
      return `1/${spend.installments}`;
    } else {
      return "-";
    }
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
              <Stack direction="row" spacing={1}>
                <Text>$</Text>
                <Input
                  required
                  marginBlockStart={4}
                  min={1}
                  name="amount"
                  placeholder="50000"
                  step="any"
                  type="number"
                  width="70px"
                />
              </Stack>
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
                  min={0}
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
            templateColumns="6fr 3fr 1fr 0.5fr"
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
          {currentPeriod?.spends.map((spend: Spend) => (
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
              templateColumns="6fr 3fr 1fr 0.5fr "
            >
              <>
                <GridItem>{spend.description}</GridItem>
                <GridItem textAlign="center">{moneyFormatter(spend.amount)}</GridItem>
                <GridItem textAlign="center">
                  {spend?.installments ? calculateInstallment(spend) : "-"}
                </GridItem>
                <GridItem className="deleteButton" justifySelf="center">
                  <Button variant="icon" onClick={() => deleteSpend(spend)}>
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
1;
