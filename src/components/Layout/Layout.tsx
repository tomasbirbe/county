import { Box, Divider, Img, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import moneyFormatter from "src/utils/moneyFormatter";

import { NavLink } from "./components/NavLink";

import Pocket from "/Icons/pocket.svg";

interface Props {
  remaining: number;
}

export const Layout: React.FC<Props> = ({ remaining }) => {
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
        {/* <Stack
          align="center"
          direction="row"
          fontSize={14}
          justify="space-evenly"
          paddingBlock={2}
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
      </Stack>
      <Outlet />
      <Stack
        align="center"
        direction="row"
        fontSize={14}
        justify="space-evenly"
        paddingBlock={2}
        width="full"
      >
        <Text>Borrar</Text>
        <Stack direction="row" justify="space-evenly" width="70%">
          <Text> {"<"} </Text>
          <Text>Agosto</Text>
          <Text> {">"} </Text>
        </Stack>
        <Text>Agregar</Text>
      </Stack>
    </>
  );
};
