import { createUserWithEmailAndPassword } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { Spend, Saving, Income } from "src/types";
import { User } from "firebase/auth";
import dayjs from "dayjs";
import { app, auth } from "../../firebase/app";

const db = getFirestore(app);

interface UserModel {
  spends: Spend[];
  savings: Saving[];
  incomes: Income[];
}

export function createNewUser(email: string, password: string) {
  createUserWithEmailAndPassword(auth, email, password).then(() => {
    const newUser: UserModel = {
      spends: [],
      savings: [],
      incomes: [],
    };

    setDoc(doc(db, "users", email, "months", dayjs().format("MMYYYY")), newUser);
  });
}

export async function addSpend(spend: Spend, user: User | null) {
  if (spend && user?.email) {
    const userDocRef = doc(db, "users", user.email, "months", dayjs().format("MMYYYY"));

    updateDoc(userDocRef, {
      spends: arrayUnion({ ...spend }),
    });
  } else {
    throw new Error("Error: You need to specify an email");
  }
}

export async function deleteSpend(spend: Spend, user: User | null) {
  if (spend && user?.email) {
    const userDocRef = doc(db, "users", user.email, "months", dayjs().format("MMYYYY"));

    await updateDoc(userDocRef, {
      spends: arrayRemove({ ...spend }),
    });
  }
}
