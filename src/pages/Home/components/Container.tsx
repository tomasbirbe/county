import { chakra } from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";

export const Container = chakra(motion.main, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});
