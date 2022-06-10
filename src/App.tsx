import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { auth } from "src/firebase/app";
import dayjs from "dayjs";
import { useAuthContext } from "./context/authContext";

// Pages

import { Home } from "./pages/Home";
import { Spends } from "./pages/Spends";
import { Savings } from "./pages/Savings";
import { Incomes } from "./pages/Incomes";
import { Login } from "./pages/Login";
import NotFound from "./pages/NotFound";

import { Layout } from "./components/Layout";
import { PrivateRoute } from "./PrivateRoute";

export const App: React.FC = () => {
  const { setUser } = useAuthContext();
  // const [checkingSession, setCheckingSession] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // setCheckingSession(true);
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogged(true);
        setUser(user);
      }
      // setCheckingSession(false);
    });
  }, []);

  return (
    <Routes>
      <Route element={<Layout />} path="/">
        <Route
          index
          element={
            <PrivateRoute isLogged={isLogged}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          element={
            <PrivateRoute isLogged={isLogged}>
              <Spends />
            </PrivateRoute>
          }
          path="spends"
        />
        <Route
          element={
            <PrivateRoute isLogged={isLogged}>
              <Savings />
            </PrivateRoute>
          }
          path="savings"
        />
        <Route
          element={
            <PrivateRoute isLogged={isLogged}>
              <Incomes />
            </PrivateRoute>
          }
          path="incomes"
        />
        <Route
          element={
            <PrivateRoute isLogged={isLogged}>
              <NotFound />
            </PrivateRoute>
          }
          path="*"
        />
      </Route>
      <Route element={isLogged ? <Navigate to="/" /> : <Login />} path="login" />
    </Routes>
  );
};

export default App;
