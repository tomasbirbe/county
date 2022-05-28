import { Box, Img, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

import { NavLink } from "./components/NavLink";

import Pocket from "/public/Icons/pocket.svg";
export const Layout: React.FC = () => {
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
          <Text>County</Text>
        </Box>
        <Stack as="ul" direction="row" spacing={8}>
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
          <Text>$500000</Text>
        </Stack>
      </Stack>
      <Outlet />
    </>
  );
};
