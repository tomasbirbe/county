import React from "react";
import { Box, Container, Icon, IconButton, Img, Stack, Text } from "@chakra-ui/react";

import ArrowUpIcon from "/Icons/arrow-up.svg";
import SavingsIcon from "/Icons/savings.svg";
import ArrowDownIcon from "/Icons/arrow-down.svg";

import { AiFillDelete } from "react-icons/ai";

import moneyFormatter from "src/utils/moneyFormatter";
import { useAuthContext } from "src/context/authContext";
import { Income, Saving, Spend, Period } from "src/types";
import { collection, deleteDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from "src/firebase/app";

interface Props {
  spends: Spend[] | undefined;
  incomes: Income[] | undefined;
  savings: Saving[] | undefined;
  county: Period[];
  setCounty: React.Dispatch<React.SetStateAction<Period[]>>;
  currentPeriod: Period | null;
  setCurrentPeriod: React.Dispatch<React.SetStateAction<Period | null>>;
}

const db = getFirestore(app);

export const Home: React.FC<Props> = ({
  spends,
  incomes,
  savings,
  county,
  setCounty,
  currentPeriod,
  setCurrentPeriod,
}) => {
  const { user } = useAuthContext();

  function totalSpends() {
    if (spends) {
      return spends.reduce((acc: number, spend: Spend) => acc + Number(spend.amount), 0);
    }

    return 0;
  }

  function totalSavings() {
    if (savings) {
      return savings.reduce((acc: number, saving: Saving) => acc + Number(saving.amount), 0);
    }

    return 0;
  }

  function totalIncomes() {
    if (incomes) {
      return incomes.reduce((acc: number, income: Income) => acc + Number(income.amount), 0);
    }

    return 0;
  }

  function deletePeriod() {
    if (currentPeriod && user?.email) {
      const updatedCounty = county.filter((period) => period.id !== currentPeriod.id);
      const id = currentPeriod.id;

      setCounty(updatedCounty);
      setCurrentPeriod(updatedCounty[updatedCounty.length - 1]);
      const countyRef = collection(db, "users", user.email, "countyData");

      getDocs(query(countyRef, where("id", "==", id))).then((docs) => {
        if (docs.size === 1) {
          docs.forEach((doc) => {
            deleteDoc(doc.ref);
          });
        }
      });
    }
  }

  return (
    <Container
      as="main"
      height="calc(100% - 71px)"
      maxWidth="full"
      paddingX={0}
      position="relative"
    >
      <Stack position="absolute" right="20px" top="15px" zIndex={1}>
        <IconButton
          aria-label="Delete period"
          bg="transparent"
          height="50px"
          icon={<Icon as={AiFillDelete} boxSize={8} color="blackAlpha.600" />}
          width="50px"
          onClick={deletePeriod}
        />
      </Stack>
      <Stack as="header" height="full">
        <Stack align="center" as="article" height="40%" justify="center" spacing={0} width="full">
          <Text variant="h3">Gastos</Text>
          <Stack align="center" direction="row" position="relative">
            <Img height="55px" position="absolute" right="100%" src={ArrowUpIcon} width="55px" />
            <Text variant="h1">{moneyFormatter(totalSpends())}</Text>
          </Stack>
        </Stack>

        <Stack align="center" as="article" direction="row" height="50%">
          <Stack align="center" justify="center" spacing={0} width="50%">
            <Text variant="h4">Ahorros</Text>
            <Stack align="center" direction="row" position="relative">
              <Img height="45px" position="absolute" right="100%" src={SavingsIcon} width="45px" />
              <Text variant="h2">{moneyFormatter(totalSavings())}</Text>
            </Stack>
          </Stack>
          <Box bg="blackAlpha.300" height="60%" width="1px" />
          <Stack align="center" justify="center" spacing={0} width="50%">
            <Text variant="h4">Ingresos</Text>
            <Stack align="center" direction="row" position="relative">
              <Img
                height="45px"
                position="absolute"
                right="100%"
                src={ArrowDownIcon}
                width="45px"
              />
              <Text variant="h2">{moneyFormatter(totalIncomes())}</Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
