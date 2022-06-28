import {
  Box,
  Button,
  chakra,
  Divider,
  Icon,
  IconButton,
  Img,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import moneyFormatter from "src/utils/moneyFormatter";
import { BsCalendar } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";

import Pocket from "/Icons/pocket.svg";
import { doc, getFirestore, setDoc } from "firebase/firestore";

import { app } from "src/firebase/app";
import { useAuthContext } from "src/context/authContext";
import dayjs from "dayjs";
import { v4 } from "uuid";
import { Period } from "src/types";
import { AnimatePresence, isValidMotionProp, motion } from "framer-motion";
import { NavLink } from "./components/NavLink";

interface Props {
  remaining: number;
  county: Period[];
  currentPeriod: Period | null;
  setCurrentPeriod: React.Dispatch<React.SetStateAction<Period | null>>;
  setCounty: React.Dispatch<React.SetStateAction<Period[]>>;
}

const db = getFirestore(app);

const SideMenu = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

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
      setCurrentPeriod(newPeriod);
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
      {currentPeriod && (
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
      )}

      <AnimatePresence>
        {showPeriods && (
          <SideMenu
            animate={{ x: "0px" }}
            bg="white"
            boxShadow="sm-white"
            exit={{ x: "-340px" }}
            height="full"
            initial={{ x: "-300px" }}
            justifyContent="space-between"
            left="0"
            position="absolute"
            top="0"
            transition={{ ease: "easeInOut", duration: "0.3" }}
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

              <Stack align="center" height="full" paddingBlock={4} spacing={3}>
                <Stack
                  align="center"
                  as="form"
                  border="1px solid"
                  borderColor="blackAlpha.400"
                  borderRadius="4px"
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
                <Box bg="blackAlpha.400" height="1px" width="90%" />
                <Stack
                  align="center"
                  as="ul"
                  bg="transparent"
                  height="full"
                  overflow="auto"
                  paddingInline={4}
                  spacing={2}
                  width="full"
                >
                  {county.map((period) => (
                    <Button
                      key={period.id}
                      as="li"
                      bg="transparent"
                      paddingBlock={4}
                      width="90%"
                      onClick={() => changePeriod(period)}
                    >
                      {period.name}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </SideMenu>
        )}
      </AnimatePresence>

      <Outlet />
    </>
  );
};
