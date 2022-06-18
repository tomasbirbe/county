import { Box, Button, Divider, Icon, Img, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import moneyFormatter from "src/utils/moneyFormatter";
import { BsCalendar } from "react-icons/bs";
import { NavLink } from "./components/NavLink";

import Pocket from "/Icons/pocket.svg";

interface Props {
  remaining: number;
}

export const Layout: React.FC<Props> = ({ remaining }) => {
  const [showPeriods, setPeriods] = useState<boolean>(false);

  function togglePeriods() {
    setPeriods((prevState: boolean) => !prevState);
  }

  return (
    <>
      <Stack align="center" as="nav" boxShadow="lg" spacing={0} width="full">
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
          </Stack>
          <Stack direction="row" justify="flex-end" width="150px">
            <Img height="30px" loading="eager" src={Pocket} width="30px" />
            <Text color="secondary.100">{moneyFormatter(remaining)}</Text>
          </Stack>
        </Stack>
        <Divider color="black" />
      </Stack>
      <Button
        bg="white"
        borderRadius="full"
        boxShadow="lg"
        height="50px"
        justifyContent="flex-end"
        left="-20px"
        paddingInlineEnd={3}
        position="absolute"
        top="50%"
        variant="icon"
        width="60px"
        onClick={togglePeriods}
      >
        <Icon as={BsCalendar} boxSize={5} />
      </Button>
      {showPeriods && (
        <Stack
          bg="white"
          height="full"
          justify="space-between"
          left="0"
          position="absolute"
          top="0"
          width="200px"
        >
          <Stack>
            <Button onClick={togglePeriods}>Atras</Button>
            <Box bg="red" height="100px" width="full" />
            <Stack as="ul" paddingBlock={4} paddingInline={4}>
              <Text as="li">
                2022
                <Stack direction="row" paddingBlock={2} paddingInlineStart={2} spacing={2}>
                  <Box bg="blackAlpha.300" width="1px" />
                  <Stack as="ul">
                    <Text as="li">JAN</Text>
                    <Text as="li">FEB</Text>
                    <Text as="li">MAR</Text>
                    <Text as="li">APR</Text>
                    <Text as="li">MAY</Text>
                  </Stack>
                </Stack>
              </Text>
              <Text as="li">2023</Text>
              <Text as="li">2024</Text>
              <Text as="li">2025</Text>
              <Text as="li">2026</Text>
              <Text as="li">2027</Text>
            </Stack>
          </Stack>
          <Button variant="unstyled">Agregar</Button>
        </Stack>
      )}
      <Outlet />
      {/* <Stack
        align="center"
        borderBlockStart="1px solid"
        borderColor="blackAlpha.200"
        bottom="0"
        // boxShadow="0px 0px 23px -3px rgba(0,0,0,0.22)"
        direction="row"
        fontSize={14}
        justify="space-evenly"
        paddingBlock={2}
        position="fixed"
        width="full"
      >
        <Text>Borrar</Text>
        <Stack direction="row" justify="space-evenly" width="70%">
          <Text> {"<"} </Text>
          <Text>Agosto</Text>
          <Text> {">"} </Text>
        </Stack>
        <Text>Agregar</Text>
      </Stack> */}
    </>
  );
};
