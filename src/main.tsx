import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import "./firebase/app";

import App from "./App";
import { theme } from "./theme";
import { AuthProvider } from "./context/authContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <App />
          <div id="portal" />
        </Router>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
