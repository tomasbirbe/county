import React, { useReducer } from "react";
import { Spend } from "src/types";
import { v4 as uuidv4 } from "uuid";
import {
  deleteSpend as deleteFromFirestore,
  addSpend as addToFirestore,
} from "src/firebase/db/User";
import { useAuthContext } from "src/context/authContext";
export enum SpendActions {
  ADD = "ADD",
  DELETE = "DELETE",
}

const spendReducer = (state: Spend[], action: any) => {
  switch (action.type) {
    case SpendActions.ADD: {
      const newSpend = action.payload;

      localStorage.setItem("spends", JSON.stringify([...state, newSpend]));

      return [...state, newSpend];
    }
    case SpendActions.DELETE: {
      const spendToRemove = action.payload;

      const updatedSpends = state.filter((spend) => spend.id !== spendToRemove.id);

      localStorage.setItem("spends", JSON.stringify(updatedSpends));

      return updatedSpends;
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

  const { user } = useAuthContext();

  const actions = {
    addSpend: (spend: Spend) => {
      const spendWithId = { ...spend, id: uuidv4() };

      addToFirestore(spendWithId, user);
      dispatch({ type: SpendActions.ADD, payload: spendWithId });
    },
    deleteSpend: (spend: Spend) => {
      deleteFromFirestore(spend, user);
      dispatch({ type: SpendActions.DELETE, payload: spend });
    },
  };

  return { spends, actions };
};
