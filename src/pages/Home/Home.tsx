import React from "react";
import { Box, chakra, Icon, IconButton, Img, Input, Stack, Text } from "@chakra-ui/react";

import ArrowUpIcon from "/Icons/arrow-up.svg";
import SavingsIcon from "/Icons/savings.svg";
import ArrowDownIcon from "/Icons/arrow-down.svg";

import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";

import moneyFormatter from "src/utils/moneyFormatter";
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
import { isValidMotionProp, motion } from "framer-motion";
import { v4 } from "uuid";
import dayjs from "dayjs";

interface Props {
  spends: Spend[] | undefined;
  incomes: Income[] | undefined;
  savings: Saving[] | undefined;
  county: Period[];
  setCounty: React.Dispatch<React.SetStateAction<Period[]>>;
  currentPeriod: Period | null;
  setCurrentPeriod: React.Dispatch<React.SetStateAction<Period | null>>;
}

const Container = chakra(motion.main, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

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

  function addPeriod(event: React.FormEvent) {
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

  if (!currentPeriod) {
    return (
      <Container
        animate={{ y: 0, opacity: 1 }}
        height="calc(100% - 81px)"
        initial={{ y: "10px", opacity: 0 }}
        maxWidth="full"
        paddingBlockStart={10}
        paddingX={0}
        position="relative"
        transition={{ ease: "easeInOut" }}
      >
        <Stack
          align="center"
          height="full"
          justify="center"
          margin="auto"
          spacing={6}
          textAlign="center"
          width="500px"
        >
          <Text fontSize={40} fontWeight="bold" lineHeight={0.5}>
            Hola!
          </Text>
          <Text>Probá crear una nueva hoja para utilizar County</Text>
          <Stack
            align="center"
            as="form"
            border="1px solid"
            borderColor="blackAlpha.400"
            borderRadius="4px"
            direction="row"
            paddingInline={1}
            width="40%"
            onSubmit={addPeriod}
          >
            <Input border="none" name="periodInput" placeholder="Abril" />
            <IconButton
              aria-label="Add new period"
              bg="transparent"
              height="30px"
              icon={<AiOutlinePlus />}
              minWidth="30px"
              type="submit"
            />
          </Stack>
        </Stack>
      </Container>
    );
  }

  return (
    <Container
      key={currentPeriod.id}
      animate={{ y: 0, opacity: 1 }}
      as={motion.div}
      height="calc(100% - 125px)"
      initial={{ y: "10px", opacity: 0 }}
      maxWidth="full"
      overflow="hidden"
      paddingBlockStart={10}
      paddingX={0}
      position="relative"
      transition={{ ease: "easeInOut" }}
    >
      <Stack position="absolute" right="20px" top="15px">
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
