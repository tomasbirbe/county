import { Box, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

import { NavLink } from "./components/NavLink";

export const Layout: React.FC = () => {
  return (
    <>
      <Stack
        align="center"
        as="nav"
        boxShadow="lg"
        direction="row"
        height="70px"
        justify="center"
        width="full"
      >
        <Box>
          <Text>County</Text>
        </Box>
        <Stack as="ul" direction="row" spacing={10}>
          <NavLink to="/">Resumen</NavLink>
        </Stack>
      </Stack>
      <Outlet />
    </>
  );
};
