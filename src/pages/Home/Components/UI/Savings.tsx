import { GridItem, GridItemProps } from "@chakra-ui/react";
import React from "react";

const Savings: React.FC<GridItemProps> = ({ children, ...rest }) => {
  return (
    <GridItem
      {...rest}
      borderInlineEnd="1px solid"
      borderInlineEndColor="blackAlpha.400"
      colStart={1}
      rowSpan={2}
    >
      {children}
    </GridItem>
  );
};

export default Savings;
