import { User } from "firebase/auth";
import React, { createContext, useContext, useState } from "react";

interface contextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
const AuthContext = createContext<contextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <>
      <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
    </>
  );
};

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (authContext) {
    const { user, setUser } = authContext;

    return { user, setUser };
  } else {
    throw new Error("You have to wrap your app with AuthProvider");
  }
};
