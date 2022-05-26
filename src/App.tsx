import React from "react";
import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { Spends } from "./pages/Spends";
import Savings from "./pages/Savings";
import Incomes from "./pages/Incomes";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

export const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />} path="/">
        <Route index element={<Home />} />
        <Route element={<Spends />} path="spends" />
        <Route element={<Savings />} path="savings" />
        <Route element={<Incomes />} path="incomes" />
        <Route element={<NotFound />} path="*" />
      </Route>
    </Routes>
  );
};

export default App;
