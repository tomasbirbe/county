import { Input } from "@chakra-ui/react";
import React from "react";

export const App: React.FC = () => {
  return (
    <div className="App">
      <p>Hello world!</p>
      <Input placeholder="hola" variant="base" />
    </div>
  );
};

export default App;
