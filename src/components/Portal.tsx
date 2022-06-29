import { createPortal } from "react-dom";

interface Props {
  children: React.ReactNode;
}

export const Portal: React.FC<Props> = ({ children }) => {
  const element = document.getElementById("portal");

  if (element) {
    return createPortal(children, element);
  }

  return <></>;
};
