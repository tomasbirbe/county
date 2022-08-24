import { Icon, IconButton } from "@chakra-ui/react";
import React from "react";
import { BiExit } from "react-icons/bi";
import { useAuthContext } from "src/context/authContext";
import { auth } from "src/firebase/app";

export function SignOutButton() {
  const { setUser } = useAuthContext();

  function signOut() {
    auth.signOut().then(() => {
      setUser(null);
    });
  }

  return (
    <IconButton
      aria-label="Delete period"
      bg="transparent"
      height="50px"
      icon={<Icon as={BiExit} boxSize={8} color="blackAlpha.600" />}
      width="50px"
      onClick={signOut}
    />
  );
}
