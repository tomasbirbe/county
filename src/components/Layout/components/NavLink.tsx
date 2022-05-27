import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  to: string;
}

export const NavLink: React.FC<Props> = ({ children, to }) => {
  return (
    <Box
      _hover={{ outlineBlockEnd: "1px solid", outlineColor: "blue" }}
      as="li"
      outlineColor="blue"
      position="relative"
      transition="200ms all ease-in-out"
    >
      <Link to={to}>{children}</Link>
    </Box>
  );
};
