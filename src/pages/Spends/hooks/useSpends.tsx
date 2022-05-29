import React, { useReducer } from "react";
import { Spend } from "src/types";

export enum SpendActions {
  ADD = "ADD",
}

const spendReducer = (state: Spend[], action: any) => {
  switch (action.type) {
    case SpendActions.ADD: {
      const newSpend = action.payload;

      localStorage.setItem("spends", JSON.stringify([...state, newSpend]));

      return [...state, newSpend];
    }
    default: {
      throw new Error("Unhandled action");
    }
  }
};

export const useSpends = () => {
  const [spends, dispatch] = useReducer(spendReducer, [], () =>
    JSON.parse(localStorage.getItem("spends") || "[]"),
  );

  const actions = {
    addSpend: (spend: Spend) => {
      dispatch({ type: SpendActions.ADD, payload: spend });
    },
  };

  return { spends, actions };
};
