import { Box } from "@chakra-ui/react";
import React from "react";

interface Props {
  onClose?: () => void;
}

export const Overlay: React.FC<Props> = ({ onClose }) => {
  return (
    <Box
      bg="blackAlpha.300"
      height="full"
      left="0"
      position="absolute"
      top="0"
      width="full"
      zIndex={1}
      onClick={onClose}
    />
  );
};
