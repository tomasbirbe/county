import React from "react";
import { Overlay } from "./Overlay";
import { Portal } from "./Portal";

interface Props {
  children: React.ReactNode;
  onClose?: () => void;
}

export const Modal: React.FC<Props> = ({ children, onClose }) => {
  return (
    <Portal>
      <Overlay onClose={onClose} />
    </Portal>
  );
};
