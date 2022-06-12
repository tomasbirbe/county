import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { auth } from "src/firebase/app";
import { useSpends } from "src/pages/Spends/hooks/useSpends";
import { useCounty } from "src/hooks/useCounty";
import dayjs from "dayjs";
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
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
import { Spend } from "./types";

import { app } from "./firebase/app";

const db = getFirestore(app);

export const App: React.FC = () => {
  const { user, setUser } = useAuthContext();
  // const [checkingSession, setCheckingSession] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  // const { county, getSpends } = useCounty();
  const [date, setDate] = useState("062022");
  const [spends, setSpends] = useState<Spend[]>([]);

  useEffect(() => {
    // setCheckingSession(true);
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogged(true);
        setUser(user);
        // spendsActions.getSpends(user);
      }
      // setCheckingSession(false);
    });
  }, []);

  useEffect(() => {
    if (user?.email) {
      getDoc(doc(db, "users", user.email, "countyData", date)).then((docSnap) => {
        if (docSnap.exists()) {
          const { spends: docSpends } = docSnap.data();

          setSpends(docSpends);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    console.log(spends);
  }, [spends]);

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
              <Spends setSpends={setSpends} spends={spends} date={date}/>
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
