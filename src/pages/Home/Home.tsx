import React from "react";
import { Box, Icon, IconButton, Stack } from "@chakra-ui/react";
import { AiFillDelete } from "react-icons/ai";
import { BiExit } from "react-icons/bi";

import { useAuthContext } from "src/context/authContext";
import { Income, Saving, Spend, Period } from "src/types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { app } from "src/firebase/app";
import { v4 } from "uuid";
import dayjs from "dayjs";
import { auth } from "src/firebase/app";
import { Container } from "./components/Container";

/* ------------------------------- Components ------------------------------- */

import { FirstTime } from "./components/FirstTime";
import { SpendsSummary } from "./components/SpendsSummary";
import { SavingsSummary } from "./components/SavingsSummary";
import { IncomesSummary } from "./components/IncomesSummary";
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
  const { user, setUser } = useAuthContext();

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

  function addPeriod(event: React.FormEvent): void {
    event.preventDefault();
    const { periodInput } = event.target as HTMLFormElement;

    if (user?.email && periodInput.value.trim()) {
      const id = v4();
      const docRef = doc(db, "users", user.email, "countyData", id);

      const newPeriod = {
        id,
        name: periodInput.value.trim(),
        spends: [],
        incomes: [],
        savings: [],
        created_at: dayjs().format("YYYY/MM/DD hh:mm:ss"),
      };

      setCounty((prevState) => [...prevState, newPeriod]);
      setCurrentPeriod(newPeriod);
      setDoc(docRef, newPeriod);
    }
  }

  function signOut() {
    auth.signOut().then(() => {
      setUser(null);
    });
  }

  if (!currentPeriod) {
    return <FirstTime addPeriod={addPeriod} />;
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
          onClick={deletePeriod}
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
