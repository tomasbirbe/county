import { Box, Button, Img, Input, Stack, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import {
  addDoc,
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import moneyFormatter from "src/utils/moneyFormatter";

import { app } from "src/firebase/app";
import { useAuthContext } from "src/context/authContext";
import { NavLink } from "./components/NavLink";

import Pocket from "/Icons/pocket.svg";

const db = getFirestore(app);

interface Props {
  remaining: number;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}

export const Layout: React.FC<Props> = ({ remaining, date, setDate }) => {
  const [showSelectDate, setShowSelectDate] = useState<boolean>(false);
  const { user } = useAuthContext();

  function handleClick() {
    setShowSelectDate((prevState: boolean) => !prevState);
  }

  function newMonth(event: React.FormEvent) {
    event.preventDefault();
    const { newDateInput } = event.target as HTMLFormElement;

    if (user?.email) {
      const userRef = doc(db, "users", user.email);
      const countyDataRef = doc(
        db,
        "users",
        user.email,
        "countyData",
        dayjs(newDateInput.value).format("YYYYMM"),
      );

      getDoc(countyDataRef).then((docSnap) => {
        if (docSnap.exists()) {
          throw new Error("This period already exists");
        } else {
          updateDoc(userRef, {
            dates: arrayUnion(newDateInput.value),
          });

          setDoc(countyDataRef, {
            date: newDateInput.value,
            spends: [],
            savings: [],
            incomes: [],
          });
        }
      });
    }
  }

  return (
    <>
      <Stack
        align="center"
        as="nav"
        boxShadow="lg"
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
          <Box position="relative">
            <Button variant="unstyled" onClick={handleClick}>
              Seleccionar mes
            </Button>
            {showSelectDate && (
              <Stack borderRadius="8px" boxShadow="lg" padding={4} position="absolute" top="70px">
                <Input type="month" value={date} onChange={(e) => setDate(e.target.value)} />
              </Stack>
            )}
          </Box>
          <Box as="form" onSubmit={newMonth}>
            <Input id="newDateInput" type="month" />
            <Button type="submit" variant="unstyled">
              Nuevo mes
            </Button>
          </Box>
        </Stack>
        <Stack direction="row" justify="flex-end" width="150px">
          <Img height="30px" loading="eager" src={Pocket} width="30px" />
          <Text color="secondary.100">{moneyFormatter(remaining)}</Text>
        </Stack>
      </Stack>
      <Outlet />
    </>
  );
};
