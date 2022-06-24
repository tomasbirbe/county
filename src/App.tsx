import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { auth } from "src/firebase/app";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { Loader } from "src/pages/Loader";
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
import { Spend, Saving, Income, Period } from "./types";

import { app } from "./firebase/app";

const db = getFirestore(app);

export const App: React.FC = () => {
  const { user, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [county, setCounty] = useState<Period[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);

  useEffect(() => {
    setIsLoading(true);
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogged(true);
        setUser(user);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user?.email) {
      const countyRef = collection(db, "users", user.email, "countyData");

      getDocs(query(countyRef)).then((doc) => {
        const countyData: Period[] = [];

        doc.forEach((docSnap) => {
          countyData.push(docSnap.data() as Period);
        });

        setCounty(countyData);
        setCurrentPeriod(countyData[0]);
      });
    }
  }, [user]);

  function calculateRemaining() {
    if (currentPeriod) {
      const totalSpends = currentPeriod.spends.reduce(
        (acc: number, spend: Spend) => acc + Number(spend.amount),
        0,
      );
      const totalSavings = currentPeriod.savings.reduce(
        (acc: number, saving: Saving) => acc + Number(saving.amount),
        0,
      );
      const totalIncomes = currentPeriod.incomes.reduce(
        (acc: number, income: Income) => acc + Number(income.amount),
        0,
      );

      return totalIncomes - totalSpends - totalSavings;
    }

    return 0;
  }

  // This is for every time that currentPeriod is modified
  useEffect(() => {
    if (currentPeriod) {
      const deletedCurrentPeriod = county.filter((period) => period.id !== currentPeriod.id);
      const sortedPeriods = [...deletedCurrentPeriod, currentPeriod].sort((a, b) => {
        if (new Date(a.created_at) >= new Date(b.created_at)) {
          return 1;
        }

        return -1;
      });

      setCounty(sortedPeriods);
    }
  }, [currentPeriod]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route
        element={
          <Layout
            county={county}
            currentPeriod={currentPeriod}
            remaining={calculateRemaining()}
            setCounty={setCounty}
            setCurrentPeriod={setCurrentPeriod}
          />
        }
        path="/"
      >
        <Route
          index
          element={
            <PrivateRoute isLogged={isLogged}>
              <Home
                county={county}
                currentPeriod={currentPeriod}
                incomes={currentPeriod?.incomes}
                savings={currentPeriod?.savings}
                setCounty={setCounty}
                setCurrentPeriod={setCurrentPeriod}
                spends={currentPeriod?.spends}
              />
            </PrivateRoute>
          }
        />
        <Route
          element={
            <PrivateRoute isLogged={isLogged}>
              <Spends currentPeriod={currentPeriod} setCurrentPeriod={setCurrentPeriod} />
            </PrivateRoute>
          }
          path="spends"
        />
        <Route
          element={
            <PrivateRoute isLogged={isLogged}>
              <Savings currentPeriod={currentPeriod} setCurrentPeriod={setCurrentPeriod} />
            </PrivateRoute>
          }
          path="savings"
        />
        <Route
          element={
            <PrivateRoute isLogged={isLogged}>
              <Incomes currentPeriod={currentPeriod} setCurrentPeriod={setCurrentPeriod} />
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
