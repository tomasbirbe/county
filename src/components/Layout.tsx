import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <>
      <Stack as="nav" bg="red" direction="row" height="50px">
        <Stack as="ul" direction="row">
          <Box as="li">
            <Link to="/">Resumen</Link>
          </Box>
          <Box as="li">
            <Link to="spends">Gastos</Link>
          </Box>
          <Box as="li">
            <Link to="savings">Ahorros</Link>
          </Box>
          <Box as="li">
            <Link to="incomes">Ingresos</Link>
          </Box>
        </Stack>
      </Stack>
      <Outlet />
    </>
  );
};

export default Layout;
