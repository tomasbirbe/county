import { GridItem, GridItemProps } from "@chakra-ui/react";
import React from "react";

const Spends: React.FC<GridItemProps> = ({ children, ...rest }) => {
  return (
    <GridItem {...rest} colEnd={3} colStart={1}>
      {children}
    </GridItem>
  );
};

export default Spends;
