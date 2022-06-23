import { Box, Button, Divider, Icon, IconButton, Img, Input, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import moneyFormatter from "src/utils/moneyFormatter";
import { BsCalendar } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";

import Pocket from "/Icons/pocket.svg";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";

import { app } from "src/firebase/app";
import { useAuthContext } from "src/context/authContext";
import dayjs from "dayjs";
import { v4 } from "uuid";
import { Period } from "src/types";
import { NavLink } from "./components/NavLink";

interface Props {
  remaining: number;
  county: Period[];
  currentPeriod: Period | null;
  setCurrentPeriod: React.Dispatch<React.SetStateAction<Period | null>>;
  setCounty: React.Dispatch<React.SetStateAction<Period[]>>;
}

const db = getFirestore(app);

export const Layout: React.FC<Props> = ({
  remaining,
  county,
  setCounty,
  currentPeriod,
  setCurrentPeriod,
}) => {
  const [showPeriods, setShowPeriods] = useState<boolean>(false);
  const { user } = useAuthContext();

  function togglePeriods() {
    setShowPeriods((prevState: boolean) => !prevState);
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
      setDoc(docRef, newPeriod);
    }
  }

  function changePeriod(period: Period) {
    setCurrentPeriod(period);
    setShowPeriods(false);
  }

  return (
    <>
      <Stack align="center" as="nav" boxShadow="sm-white" spacing={0} width="full">
        <Stack
          align="center"
          as="nav"
          direction="row"
          height="70px"
          justify="space-between"
          paddingInline={6}
          width="full"
        >
          <Box width="150px">
            <Text fontWeight="700">County</Text>
          </Box>
          <Stack align="center" as="ul" direction="row" height="full" spacing={8}>
            <NavLink to="/">Resumen</NavLink>
            <NavLink to="/spends" underlineColor="spend">
              Gastos
            </NavLink>
            <NavLink to="/savings" underlineColor="saving">
              Ahorros
            </NavLink>
            <NavLink to="/incomes" underlineColor="income">
              Ingresos
            </NavLink>
            <Text>{currentPeriod?.name || ""}</Text>
          </Stack>
          <Stack direction="row" justify="flex-end" width="150px">
            <Img height="30px" loading="eager" src={Pocket} width="30px" />
            <Text color="secondary.100">{moneyFormatter(remaining)}</Text>
          </Stack>
        </Stack>
        <Divider color="black" />
      </Stack>
      <IconButton
        aria-label="Close side menu"
        bg="white"
        borderInlineEndRadius="full"
        boxShadow="sm-white"
        height="50px"
        icon={<Icon as={BsCalendar} boxSize={5} marginInlineEnd={1} />}
        left="0px"
        minWidth="30px"
        position="absolute"
        top="50%"
        width="40px"
        zIndex={2}
        onClick={togglePeriods}
      />
      {showPeriods && (
        <Stack
          bg="white"
          boxShadow="sm-white"
          height="full"
          justify="space-between"
          left="0"
          position="absolute"
          top="0"
          width="300px"
          zIndex={2}
        >
          <Stack height="full" position="relative" spacing={0}>
            <IconButton
              aria-label="Close side menu"
              bg="white"
              borderInlineEndRadius="full"
              boxShadow="sm-white"
              height="50px"
              icon={<Icon as={IoIosArrowBack} boxSize={5} marginInlineEnd={1} />}
              minWidth="30px"
              position="absolute"
              right="-40px"
              top="50%"
              width="40px"
              onClick={togglePeriods}
            />

            <Stack align="center" height="full" paddingBlock={4} spacing={0}>
              <Stack
                align="center"
                as="form"
                borderBlockEnd="1px solid"
                borderColor="blackAlpha.400"
                direction="row"
                width="90%"
                onSubmit={addPeriod}
              >
                <Input border="none" id="periodInput" name="periodInput" placeholder="Abril" />
                <IconButton
                  aria-label="Add new period"
                  bg="transparent"
                  height="30px"
                  icon={<AiOutlinePlus />}
                  minWidth="30px"
                  type="submit"
                />
              </Stack>
              <Stack
                as="ul"
                bg="transparent"
                height="full"
                overflow="auto"
                paddingBlockStart={4}
                paddingInline={4}
                spacing={0}
              >
                {county.map((period) => (
                  <Button
                    key={period.id}
                    as="li"
                    bg="transparent"
                    paddingBlock={4}
                    onClick={() => changePeriod(period)}
                  >
                    {period.name}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}

      <Outlet />
    </>
  );
};
