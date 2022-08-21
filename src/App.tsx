import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { auth } from "src/firebase/app";
import { Loader } from "src/pages/Loader";

/* ------------------------------ Custom Hooks ------------------------------ */

import { useSheets } from "src/hooks/useSheets";
import { useAuthContext } from "src/context/authContext";

// Pages

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import NotFound from "./pages/NotFound";

import { Layout } from "./components/Layout";
import { PrivateRoute } from "./PrivateRoute";
import { Spend, Saving, Income } from "./types";

export const App: React.FC = () => {
  const { user, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const { getSheets, sheets, deleteCurrentSheet, currentSheet, addSheet } = useSheets(user);

  useEffect(() => {
    setIsLoading(true);
    auth.onAuthStateChanged((user) => {
      getSheets()
        .then(() => {
          setIsLogged(true);
          setUser(user);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLogged(false);
          setIsLoading(false);
        });
    });
  }, [user]);

  function calculateRemaining() {
    if (currentSheet) {
      const totalSpends = currentSheet.spends.reduce(
        (acc: number, spend: Spend) => acc + Number(spend.amount),
        0,
      );
      const totalSavings = currentSheet.savings.reduce(
        (acc: number, saving: Saving) => acc + Number(saving.amount),
        0,
      );
      const totalIncomes = currentSheet.incomes.reduce(
        (acc: number, income: Income) => acc + Number(income.amount),
        0,
      );

      return totalIncomes - totalSpends - totalSavings;
    }

    return 0;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route
        element={
          <Layout
            addSheet={addSheet}
            county={sheets}
            currentPeriod={currentSheet}
            remaining={calculateRemaining()}
          />
        }
        path="/"
      >
        <Route
          index
          element={
            <PrivateRoute isLogged={isLogged}>
              <Home
                addSheet={addSheet}
                currentPeriod={currentSheet}
                deleteCurrentSheet={deleteCurrentSheet}
              />
            </PrivateRoute>
          }
        />
        {/* <Route
          element={
            sheets.length ? (
              <PrivateRoute isLogged={isLogged}>
                <Spends currentPeriod={currentSheet} setCurrentPeriod={setCurrentPeriod} />
              </PrivateRoute>
            ) : (
              <NotFound />
            )
          }
          path="spends"
        />
        <Route
          element={
            sheets.length ? (
              <PrivateRoute isLogged={isLogged}>
                <Savings currentPeriod={currentPeriod} setCurrentPeriod={setCurrentPeriod} />
              </PrivateRoute>
            ) : (
              <NotFound />
            )
          }
          path="savings"
        />
        <Route
          element={
            county.length ? (
              <PrivateRoute isLogged={isLogged}>
                <Incomes currentPeriod={currentPeriod} setCurrentPeriod={setCurrentPeriod} />
              </PrivateRoute>
            ) : (
              <NotFound />
            )
          }
          path="incomes"
        /> */}
        <Route
          element={
            <PrivateRoute isLogged={isLogged}>
              <NotFound />
            </PrivateRoute>
          }
          path="*"
        />
      </Route>

      <Route element={isLogged ? <Navigate to="/" /> : <Register />} path="register" />
      <Route element={isLogged ? <Navigate to="/" /> : <Login />} path="login" />
    </Routes>
  );
};

export default App;
