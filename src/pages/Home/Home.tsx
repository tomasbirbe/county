import React from "react";
import { Box, Icon, IconButton, Stack } from "@chakra-ui/react";
import { AiFillDelete } from "react-icons/ai";
import { BiExit } from "react-icons/bi";

import { useAuthContext } from "src/context/authContext";
import { Income, Saving, Spend, Sheet } from "src/types";
import { auth } from "src/firebase/app";
import { Container } from "./components/Container";

/* ------------------------------- Components ------------------------------- */

import { FirstTime } from "./components/FirstTime";
import { SpendsSummary } from "./components/SpendsSummary";
import { SavingsSummary } from "./components/SavingsSummary";
import { IncomesSummary } from "./components/IncomesSummary";
interface Props {
  currentPeriod: Sheet | null;
  addSheet: (arg01: string) => void;
  deleteCurrentSheet: () => void;
}

export const Home: React.FC<Props> = ({ currentPeriod, addSheet, deleteCurrentSheet }) => {
  const { setUser } = useAuthContext();

  function totalSpends() {
    if (currentPeriod?.spends) {
      return currentPeriod.spends.reduce(
        (acc: number, spend: Spend) => acc + Number(spend.amount),
        0,
      );
    }

    return 0;
  }

  function totalSavings() {
    if (currentPeriod?.savings) {
      return currentPeriod.savings.reduce(
        (acc: number, saving: Saving) => acc + Number(saving.amount),
        0,
      );
    }

    return 0;
  }

  function totalIncomes() {
    if (currentPeriod?.incomes) {
      return currentPeriod.incomes.reduce(
        (acc: number, income: Income) => acc + Number(income.amount),
        0,
      );
    }

    return 0;
  }

  function signOut() {
    auth.signOut().then(() => {
      setUser(null);
    });
  }

  if (!currentPeriod) {
    return <FirstTime addPeriod={addSheet} />;
  }

  return (
    <Container key={currentPeriod.id}>
      <Stack position="absolute" right="20px" top="15px">
        <IconButton
          aria-label="Delete period"
          bg="transparent"
          height="50px"
          icon={<Icon as={AiFillDelete} boxSize={8} color="blackAlpha.600" />}
          width="50px"
          onClick={deleteCurrentSheet}
        />
        <IconButton
          aria-label="Delete period"
          bg="transparent"
          height="50px"
          icon={<Icon as={BiExit} boxSize={8} color="blackAlpha.600" />}
          width="50px"
          onClick={signOut}
        />
      </Stack>
      <Stack height="full">
        <SpendsSummary totalSpends={totalSpends()} />

        <Stack align="center" as="article" direction="row" height="50%">
          <SavingsSummary totalSavings={totalSavings()} />
          <Box bg="blackAlpha.300" height="60%" width="1px" />
          <IncomesSummary totalIncomes={totalIncomes()} />
        </Stack>
      </Stack>
    </Container>
  );
};
