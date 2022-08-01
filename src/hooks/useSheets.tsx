import React, { useState } from "react";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { Sheet } from "src/types";
import { app } from "src/firebase/app";
import { User } from "firebase/auth";

const db = getFirestore(app);

export const useSheets = (user: User | null) => {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [currentSheet, setCurrentSheet] = useState<Sheet | null>(null);

  async function getSheets() {
    if (user?.email) {
      try {
        const countyRef = collection(db, "users", user.email, "countyData");
        const doc = await getDocs(query(countyRef));
        const countyData: Sheet[] = [];

        doc.forEach((docSnap) => {
          countyData.push(docSnap.data() as Sheet);
        });
        setSheets(countyData);
        selectSheet(countyData[0]);
      } catch (error) {
        throw new Error(`${error}`);
      }
    }
  }

  function selectSheet(sheet: Sheet) {
    setCurrentSheet(sheet);
  }

  function addSheet(sheet: Sheet) {
    
  }

  return { currentSheet, selectSheet, getSheets, sheets };
};
