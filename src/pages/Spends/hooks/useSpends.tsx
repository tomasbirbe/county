import React, { useReducer } from "react";
import { Spend } from "src/types";
import { v4 as uuidv4 } from "uuid";
import {
  deleteSpend as deleteFromFirestore,
  addSpend as addToFirestore,
} from "src/firebase/db/User";
import { useAuthContext } from "src/context/authContext";
import { arrayUnion, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
export enum SpendActions {
  ADD = "ADD",
  DELETE = "DELETE",
}

import { app } from "src/firebase/app";
import { User } from "firebase/auth";
import dayjs from "dayjs";

const db = getFirestore(app);

const spendReducer = (state: Spend[], action: any) => {
  switch (action.type) {
    case SpendActions.ADD: {
      const newSpend = action.payload;

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

// export const useSpends = () => {
//   const [spends, dispatch] = useReducer(spendReducer, []);

//   const { user } = useAuthContext();

//   const spendsActions = {
//     getSpends: (user: User) => {
//       if (user?.email) {
//         getDoc(doc(db, "users", user.email, "months", dayjs().format("MMYYYY"))).then((docSnap) =>
//           console.log(docSnap.data()),
//         );
//       }
//     },
//     addSpend: (spend: Spend, user: User | null) => {
//       const newSpend = { ...spend, id: uuidv4() };

//       if (user?.email) {
//         updateDoc(doc(db, "users", user.email, "months", dayjs().format("MMYYYY ")), {
//           spends: arrayUnion(newSpend),
//         }).then(() => {
//           dispatch({ type: SpendActions.ADD, payload: newSpend });
//         });
//       } else {
//         throw new Error("Error: The email could be wrong");
//       }
//     },
//     deleteSpend: (spend: Spend) => {
//       deleteFromFirestore(spend, user);
//       dispatch({ type: SpendActions.DELETE, payload: spend });
//     },
//   };

//   return { spends, spendsActions };
// };

export const useSpends = (initialValue: Spend[]) => {
  const [spends, dispatch] = useReducer(spendReducer, initialValue);

  return { spends };
};
