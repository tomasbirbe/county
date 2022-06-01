import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  isLogged: boolean;
  children: JSX.Element;
}

export const PrivateRoute: React.FC<Props> = ({ isLogged, children }) => {
  if (isLogged) {
    return children;
  }

  console.log(isLogged);

  return <Navigate to="/login" />;
};
