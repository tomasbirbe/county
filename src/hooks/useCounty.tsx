import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSpends } from "src/pages/Spends/hooks/useSpends";

import { app } from "src/firebase/app";
import { useAuthContext } from "src/context/authContext";
import dayjs from "dayjs";
import { Spend, Income, Saving } from "src/types";

const db = getFirestore(app);

interface UserMonth {
  date: string;
  spends: Spend[];
  incomes: Income[];
  savings: Saving[];
}

export const useCounty = () => {
  const { user } = useAuthContext();
  const [county, setCounty] = useState<UserMonth[]>([]);

  useEffect(() => {
    if (user?.email) {
      getDocs(query(collection(db, "users", user.email, "finances")))
        .then((userMonths) => {
          const data: UserMonth[] = [];

          userMonths.forEach((userMonth) => {
            data.push(userMonth.data() as UserMonth);
          });
          setCounty(data);
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  // function getSpends() {
  //   if (user?.email) {
  //     const spends = county.map((month) => {
  //       return { date: month.date, spends: month.spends };
  //     });

  //     return spends;
  //   }
  // }

  return { county, getSpends };
};
