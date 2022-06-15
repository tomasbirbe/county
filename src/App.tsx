import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { auth } from "src/firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
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
import { Spend, Saving, Income } from "./types";

import { app } from "./firebase/app";

const db = getFirestore(app);

export const App: React.FC = () => {
  const { user, setUser } = useAuthContext();
  // const [checkingSession, setCheckingSession] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  // const { county, getSpends } = useCounty();
  const [date, setDate] = useState(() => dayjs().format("YYYY-MM"));
  const [spends, setSpends] = useState<Spend[]>([]);
  const [savings, setSavings] = useState<Saving[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

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

  useEffect(() => {
    if (user?.email) {
      const docRef = doc(db, "users", user.email, "countyData", dayjs(date).format("YYYYMM"));

      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const { spends: docSpends, savings: docSavings, incomes: docIncomes } = docSnap.data();

          setSpends(docSpends);
          setSavings(docSavings);
          setIncomes(docIncomes);
        }
      });
    }
  }, [user, date]);

  function calculateRemaining() {
    const totalSpends = spends.reduce((acc: number, spend: Spend) => acc + Number(spend.amount), 0);
    const totalSavings = savings.reduce(
      (acc: number, saving: Saving) => acc + Number(saving.amount),
      0,
    );
    const totalIncomes = incomes.reduce(
      (acc: number, income: Income) => acc + Number(income.amount),
      0,
    );

    return totalIncomes - totalSpends - totalSavings;
  }

  return (
    <Routes>
      <Route
        element={<Layout date={date} remaining={calculateRemaining()} setDate={setDate} />}
        path="/"
      >
        <Route
          index
          element={
            <PrivateRoute isLogged={isLogged}>
              <Home incomes={incomes} savings={savings} spends={spends} />
            </PrivateRoute>
          }
        />
        <Route
          element={
            <PrivateRoute isLogged={isLogged}>
              <Spends date={date} setSpends={setSpends} spends={spends} />
            </PrivateRoute>
          }
          path="spends"
        />
        <Route
          element={
            <PrivateRoute isLogged={isLogged}>
              <Savings date={date} savings={savings} setSavings={setSavings} />
            </PrivateRoute>
          }
          path="savings"
        />
        <Route
          element={
            <PrivateRoute isLogged={isLogged}>
              <Incomes date={date} incomes={incomes} setIncomes={setIncomes} />
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
