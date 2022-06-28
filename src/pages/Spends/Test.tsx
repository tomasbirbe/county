import { chakra } from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import React from "react";

export const Container = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});
