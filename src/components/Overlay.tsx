import { Box } from "@chakra-ui/react";
import React from "react";

interface Props {
  onClose?: () => void;
}

export const Overlay: React.FC<Props> = ({ onClose }) => {
  return (
    <Box
      bg="blackAlpha.300"
      height="100vh"
      left="0"
      position="absolute"
      top="0"
      width="100vw"
      onClick={onClose}
    />
  );
};
