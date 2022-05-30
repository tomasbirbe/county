import React, { useReducer } from "react";

interface Saving {
  id: string;
  description: string;
  amount: string;
}

enum SavingsActions {
  ADD = "ADD",
  DELETE = "DELETE",
}

const savingsReducer = (state: Saving[], action: any) => {
  switch (action.type) {
    case SavingsActions.ADD: {
      const newSaving = action.payload;

      localStorage.setItem("savings", JSON.stringify([...state, newSaving]));

      return [...state, newSaving];
    }
    case SavingsActions.DELETE: {
      const id = action.payload;
      const updatedSavings = state.filter((saving) => saving.id !== id);

      return updatedSavings;
    }
    default: {
      throw new Error("Unhandled action");
    }
  }
};

export const useSavings = () => {
  const [savings, dispatch] = useReducer(savingsReducer, [], () =>
    JSON.parse(localStorage.getItem("savings") || "[]"),
  );

  const actions = {
    addSaving: (saving: Saving) => {
      dispatch({ type: SavingsActions.ADD, payload: saving });
    },
    deleteSaving: (saving: string) => {
      dispatch({ type: SavingsActions.DELETE, payload: saving });
    },
  };

  return { savings, actions };
};
