import React, { useState } from "react";
import {
  Stack,
  Img,
  Text,
  Box,
  Button,
  Input,
  Select,
  Grid,
  GridItem,
  chakra,
} from "@chakra-ui/react";

import DeleteIcon from "/Icons/delete.svg";

import moneyFormatter from "src/utils/moneyFormatter";
import { KindOfSpend, Spend, Period } from "src/types";

import { useAuthContext } from "src/context/authContext";
import { v4 } from "uuid";
import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "src/firebase/app";
import dayjs from "dayjs";

/* ------------------------------- Components ------------------------------- */
import { Container } from "./components/Container";
import { Header } from "./components/Header";
import { CreateSpendButton } from "./components/CreateSpendButton";
import { CreateSpendForm } from "./components/CreateSpendForm";

const db = getFirestore(app);
let timer: string | number | NodeJS.Timeout | undefined;

interface Props {
  setCurrentPeriod: React.Dispatch<React.SetStateAction<Period | null>>;
  currentPeriod: Period | null;
}

export const Spends: React.FC<Props> = ({ setCurrentPeriod, currentPeriod }) => {
  const { user } = useAuthContext();
  const [kindOfSpend, setKindOfSpend] = useState<KindOfSpend>(KindOfSpend.NOINSTALLMENTS);

  const [showForm, setShowForm] = useState(false);

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

    const newSpend: Spend = {
      id: v4(),
      description: description.value,
      amount: amount.value,
      kind: kind.value,
      totalInstallments:
        kind.value !== KindOfSpend.INSTALLMENTS ? null : Number(installments?.value),
      currentInstallment: kind.value !== KindOfSpend.INSTALLMENTS ? null : 1,
      created_at: dayjs().format("YYYY/MM/DD hh:mm:ss"),
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
    setShowForm(false);
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

  function incrementInstallment(spend: Spend) {
    clearTimeout(timer);
    if (currentPeriod?.spends && spend.currentInstallment && spend.totalInstallments) {
      const updateSpend: Spend = {
        ...spend,
        currentInstallment:
          spend.currentInstallment < spend.totalInstallments
            ? spend.currentInstallment + 1
            : spend.currentInstallment,
      };

      const updatedSpends: Spend[] = [
        ...currentPeriod.spends.filter((spendItem) => spendItem.id !== spend.id),
        updateSpend,
      ];

      const sortedSpends = updatedSpends.sort((a, b) => {
        if (new Date(a.created_at) >= new Date(b.created_at)) {
          return 1;
        }

        return -1;
      });

      setCurrentPeriod((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            spends: sortedSpends,
          };
        }

        return null;
      });
      if (user?.email) {
        const docRef = doc(db, "users", user.email, "countyData", currentPeriod.id);

        timer = setTimeout(() => {
          updateDoc(docRef, {
            spends: sortedSpends,
          });
        }, 1000);
      }
    }
  }

  function decrementInstallment(spend: Spend) {
    clearTimeout(timer);
    if (currentPeriod?.spends && spend.currentInstallment && spend.totalInstallments) {
      const updateSpend: Spend = {
        ...spend,
        currentInstallment:
          spend.currentInstallment > 1 ? spend.currentInstallment - 1 : spend.currentInstallment,
      };

      const updatedSpends: Spend[] = [
        ...currentPeriod.spends.filter((spendItem) => spendItem.id !== spend.id),
        updateSpend,
      ];

      const sortedSpends = updatedSpends.sort((a, b) => {
        if (new Date(a.created_at) >= new Date(b.created_at)) {
          return 1;
        }

        return -1;
      });

      setCurrentPeriod((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            spends: sortedSpends,
          };
        }

        return null;
      });
      if (user?.email) {
        const docRef = doc(db, "users", user.email, "countyData", currentPeriod.id);

        timer = setTimeout(() => {
          updateDoc(docRef, {
            spends: sortedSpends,
          });
        }, 1000);
      }
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

  function openForm() {
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
  }

  return (
    <Container key={currentPeriod?.id}>
      <Header totalSpends={totalSpends()} />
      <CreateSpendButton handleClick={openForm} />

      <Box marginInline="auto" paddingBlockStart={8} width="80%">
        {showForm && (
          <CreateSpendForm
            handleSelect={handleSelect}
            handleSubmit={addSpend}
            kindOfSpend={kindOfSpend}
            onClose={closeForm}
          />
        )}
        {currentPeriod?.spends.length ? (
          <Stack direction="row" spacing={10}>
            <Stack spacing={0} width="full">
              <Grid
                borderBlockEnd="1px solid"
                borderColor="primary.600"
                marginBlockEnd={2}
                paddingBlockEnd={2}
                paddingInline={2}
                templateColumns="repeat(12, 1fr)"
              >
                <GridItem colSpan={6} color="gray.500" fontWeight="600">
                  Descripcion
                </GridItem>
                <GridItem colSpan={3} color="gray.500" fontWeight="600" textAlign="center">
                  Gasto
                </GridItem>
                <GridItem colSpan={2} color="gray.500" fontWeight="600" textAlign="center">
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
                  templateColumns="repeat(12, 1fr)"
                >
                  <GridItem colSpan={6}>{spend.description}</GridItem>
                  <GridItem colSpan={3} textAlign="center">
                    <Stack align="center">
                      <Text textAlign="center">{moneyFormatter(spend.amount)}</Text>
                    </Stack>
                  </GridItem>
                  <GridItem colSpan={2} textAlign="center">
                    {spend.kind === KindOfSpend.INSTALLMENTS ? (
                      <Stack align="center" direction="row" justify="center">
                        <Button
                          bg="transparent"
                          borderRadius="full"
                          height="32px"
                          minWidth="25px"
                          width="32px"
                          onClick={() => decrementInstallment(spend)}
                        >
                          -
                        </Button>
                        <Text>{`${spend.currentInstallment}/${spend.totalInstallments}`}</Text>
                        <Button
                          bg="transparent"
                          borderRadius="full"
                          height="32px"
                          minWidth="25px"
                          width="32px"
                          onClick={() => incrementInstallment(spend)}
                        >
                          +
                        </Button>
                      </Stack>
                    ) : (
                      "-"
                    )}
                  </GridItem>
                  <GridItem className="deleteButton" colSpan={1}>
                    <Stack align="center">
                      <Button
                        _active={{ bg: "transparent" }}
                        _hover={{ bg: "white" }}
                        variant="icon"
                        onClick={() => deleteSpend(spend)}
                      >
                        <Img height="25px" src={DeleteIcon} width="25px" />
                      </Button>
                    </Stack>
                  </GridItem>
                </Grid>
              ))}
            </Stack>
          </Stack>
        ) : (
          <Stack align="center" paddingBlockStart={6} width="full">
            <Text>Todavia no tenes ningun gasto. Probá crear uno nuevo!</Text>
          </Stack>
        )}
      </Box>
    </Container>
  );
};
