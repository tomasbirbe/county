import React from "react";
import { chakra, Divider, Grid, Text } from "@chakra-ui/react";
import { isValidMotionProp, motion } from "framer-motion";
import { Overlay } from "./Overlay";
import { Portal } from "./Portal";

interface Props {
  children: React.ReactNode;
  title: string;
  onClose?: () => void;
}

const ModalContainer = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

export const FormModal: React.FC<Props> = ({ children, onClose, title }) => {
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
          {title && (
            <>
              <Text fontSize={20} fontWeight="bold">
                {title}
              </Text>
              <Divider />
            </>
          )}
          {children}
        </ModalContainer>
      </Grid>
    </Portal>
  );
};
