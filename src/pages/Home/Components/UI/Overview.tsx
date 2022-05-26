import { Grid, GridProps } from "@chakra-ui/react";
import React, { HTMLAttributes } from "react";

const Overview: React.FC<GridProps> = ({ children, ...rest }) => {
  return (
    <Grid {...rest} templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)" width="full">
      {children}
    </Grid>
  );
};

export default Overview;
