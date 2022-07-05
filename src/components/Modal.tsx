import React from "react";
import { chakra, Divider, Grid, Stack, Text } from "@chakra-ui/react";
import { isValidMotionProp, motion } from "framer-motion";
import { Overlay } from "./Overlay";
import { Portal } from "./Portal";

interface Props {
  children: React.ReactNode;
  onClose?: () => void;
}

const ModalContainer = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

export const Modal: React.FC<Props> = ({ children, onClose }) => {
  return (
    <Portal>
      <Grid height="full" left="0" placeItems="center" position="fixed" top="0" width="full">
        <Overlay onClose={onClose} />
        <ModalContainer
          animate={{ y: 0, opacity: 1 }}
          bg="white"
          borderRadius="4px"
          display="flex"
          flexDirection="column"
          gap={5}
          initial={{ y: "10px", opacity: 0 }}
          paddingBlock={8}
          paddingInline={6}
          transition={{ ease: "easeInOut", duration: "0.2" }}
          width="fit-content"
          zIndex={2}
        >
          <Text fontSize={20} fontWeight="bold">
            Agrega un gasto nuevo
          </Text>
          <Divider />
          {children}
        </ModalContainer>
      </Grid>
    </Portal>
  );
};
