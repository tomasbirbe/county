import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  to: string;
  underlineColor?: string;
}

export const NavLink: React.FC<Props> = ({ children, to, underlineColor = "#2C2C2C" }) => {
  return (
    <Box
      _hover={{
        textDecorationColor: underlineColor,
        textDecorationLine: "underline",
        textDecorationThickness: "4px",
        textUnderlineOffset: "5px",
      }}
      as="li"
      position="relative"
      textDecorationColor="transparent"
      textDecorationLine="underline"
      textDecorationThickness="4px"
      textUnderlineOffset="5px"
      transition="200ms all ease-in-out"
    >
      <Link to={to}>{children}</Link>
    </Box>
  );
};
