import { Box, chakra, Icon, Stack, Text } from "@chakra-ui/react";
import { AnimatePresence, isValidMotionProp, motion } from "framer-motion";
import React from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { Overlay } from "./Overlay";
import { Portal } from "./Portal";

interface Props {
  children: React.ReactNode;
  onClose?: () => void;
  type?: string;
  size?: string;
}

const AlertContainer = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

export const Alert: React.FC<Props> = ({ children, onClose }) => {
  return (
    <Portal>
      <Overlay onClose={onClose} />
      <AlertContainer
        animate={{ y: 0, opacity: 1 }}
        bg="white"
        borderRadius="8px"
        height="250px"
        initial={{ y: "50px", opacity: 0 }}
        left="calc(50% - 200px)"
        paddingBlockStart="35px"
        position="absolute"
        top="calc(50% - 125px)"
        transition={{ duration: "0.3" }}
        width="400px"
      >
        <Box
          bg="yellow.500"
          border="3px solid"
          borderColor="white"
          borderRadius="full"
          height="70px"
          left="calc(50% - 35px)"
          position="absolute"
          top="-35px"
          width="70px"
        >
          <Box color="blackAlpha.700" margin="auto" marginBlockStart={3} width="fit-content">
            <Icon as={AiOutlineWarning} boxSize={9} />
          </Box>
        </Box>
        {children}
      </AlertContainer>
    </Portal>
  );
};
