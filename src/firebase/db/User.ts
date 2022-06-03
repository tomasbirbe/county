import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Spend, Saving, Income } from "src/types";

import { register } from "../../auth";
import { app } from "../initialize";

const db = getFirestore(app);

interface User {
  spends: Spend[];
  savings: Saving[];
  incomes: Income[];
}

export function createNewUser(email: string, password: string) {
  register(email, password).then(() => {
    const newUser: User = {
      spends: [],
      savings: [],
      incomes: [],
    };

    setDoc(doc(db, "users", email), newUser);
  });
}
