import { GridItem, GridItemProps } from "@chakra-ui/react";
import React from "react";

const Incomes: React.FC<GridItemProps> = ({ children, ...rest }) => {
  return (
    <GridItem {...rest} colStart={2} rowSpan={2}>
      {children}
    </GridItem>
  );
};

export default Incomes;
