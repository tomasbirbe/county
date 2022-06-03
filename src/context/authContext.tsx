import React, { createContext, useContext, useState } from "react";

interface contextType {
  auth: string;
  setAuth: React.Dispatch<React.SetStateAction<string>>;
}
const AuthContext = createContext<contextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<string>("");

  return (
    <>
      <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
    </>
  );
};

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (authContext) {
    const { auth, setAuth } = authContext;

    return { auth, setAuth };
  } else {
    throw new Error("You have to wrap your app with AuthProvider");
  }
};
