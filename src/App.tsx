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
import { Spends } from "./pages/Spends";
import { Savings } from "./pages/Savings";
import { Incomes } from "./pages/Incomes";
import { Layout } from "./components/Layout";
import { PrivateRoute } from "./PrivateRoute";
import { Spend, Saving, Income } from "./types";

export const App: React.FC = () => {
  const { user, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const {
    getSheets,
    spendsActions,
    savingsActions,
    incomesActions,
    sheets,
    deleteCurrentSheet,
    selectSheet,
    currentSheet,
    addSheet,
  } = useSheets(user);

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
            currentSheet={currentSheet}
            remaining={calculateRemaining()}
            selectSheet={selectSheet}
            sheets={sheets}
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
        <Route
          element={
            sheets.length ? (
              <PrivateRoute isLogged={isLogged}>
                <Spends
                  addSpend={spendsActions.addSpend}
                  currentPeriod={currentSheet}
                  decrementInstallment={spendsActions.decrementInstallment}
                  deleteSpend={spendsActions.deleteSpend}
                  incrementInstallment={spendsActions.incrementInstallment}
                />
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
                <Savings
                  addSaving={savingsActions.addSaving}
                  currentSheet={currentSheet}
                  deleteSaving={savingsActions.deleteSaving}
                />
              </PrivateRoute>
            ) : (
              <NotFound />
            )
          }
          path="savings"
        />

        <Route
          element={
            sheets.length ? (
              <PrivateRoute isLogged={isLogged}>
                <Incomes
                  addIncome={incomesActions.addIncome}
                  currentSheet={currentSheet}
                  deleteIncome={incomesActions.deleteIncome}
                />
              </PrivateRoute>
            ) : (
              <NotFound />
            )
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

      <Route element={isLogged ? <Navigate to="/" /> : <Register />} path="register" />
      <Route element={isLogged ? <Navigate to="/" /> : <Login />} path="login" />
    </Routes>
  );
};

export default App;
