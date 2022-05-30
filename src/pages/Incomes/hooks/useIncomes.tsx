import React, { useReducer } from "react";

interface Income {
  id: string;
  description: string;
  amount: string;
}

enum IncomesActions {
  ADD = "ADD",
  DELETE = "DELETE",
}

const incomesReducer = (state: Income[], action: any) => {
  switch (action.type) {
    case IncomesActions.ADD: {
      const newIncome = action.payload;

      localStorage.setItem("incomes", JSON.stringify([...state, newIncome]));

      return [...state, newIncome];
    }
    case IncomesActions.DELETE: {
      const id = action.payload;
      const updatedIncomes = state.filter((income) => income.id !== id);

      return updatedIncomes;
    }
    default: {
      throw new Error("Unhandled action");
    }
  }
};

export const useIncomes = () => {
  const [incomes, dispatch] = useReducer(incomesReducer, [], () =>
    JSON.parse(localStorage.getItem("incomes") || "[]"),
  );

  const actions = {
    addIncome: (income: Income) => {
      dispatch({ type: IncomesActions.ADD, payload: income });
    },
    deleteIncome: (income: string) => {
      dispatch({ type: IncomesActions.DELETE, payload: income });
    },
  };

  return { incomes, actions };
};
