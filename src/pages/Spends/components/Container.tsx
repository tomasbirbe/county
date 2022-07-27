import { chakra } from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";

const AnimatedContainer = chakra(motion.main, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

interface Props {
  children: React.ReactNode;
}

export const Container: React.FC<Props> = ({ children, ...props }) => {
  return (
    <AnimatedContainer
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: "10px", opacity: 0 }}
      maxWidth="full"
      paddingBlock={6}
      paddingX={0}
      transition={{ ease: "easeInOut" }}
      {...props}
    >
      {children}
    </AnimatedContainer>
  );
};
