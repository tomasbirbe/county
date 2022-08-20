import React, { useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Sheet } from "src/types";
import { app } from "src/firebase/app";
import { User } from "firebase/auth";
import { v4 } from "uuid";
import dayjs from "dayjs";
import orderByDate from "src/utils/orderByDate";

const db = getFirestore(app);

export const useSheets = (user: User | null) => {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [currentSheet, setCurrentSheet] = useState<Sheet | null>(null);

  function getSheets() {
    return new Promise<void>((resolve, reject) => {
      if (user?.email) {
        const countyRef = collection(db, "users", user.email, "countyData");

        getDocs(query(countyRef)).then((doc) => {
          const countyData: Sheet[] = [];

          doc.forEach((docSnap) => {
            countyData.push(docSnap.data() as Sheet);
          });
          setSheets(countyData);
          selectSheet(countyData[0]);
          resolve();
        });
      } else {
        reject();
      }
    });
  }

  function selectSheet(sheet: Sheet) {
    setCurrentSheet(sheet);
  }

  function addSheet(name: string) {
    if (user?.email) {
      const id = v4();
      const docRef = doc(db, "users", user.email, "countyData", id);

      const newSheet = {
        id,
        name: name.trim(),
        spends: [],
        incomes: [],
        savings: [],
        created_at: dayjs().format("YYYY/MM/DD hh:mm:ss"),
      };

      setSheets((prevState) => orderByDate([...prevState, newSheet]));
      setCurrentSheet(newSheet);
      setDoc(docRef, newSheet);
    }
  }

  function deleteCurrentSheet() {
    if (user?.email && currentSheet) {
      const updatedCounty = sheets.filter((sheet) => sheet.id !== currentSheet.id);
      const id = currentSheet.id;

      setCurrentSheet(updatedCounty[updatedCounty.length - 1]);
      const countyRef = collection(db, "users", user.email, "countyData");

      getDocs(query(countyRef, where("id", "==", id))).then((docs) => {
        if (docs.size === 1) {
          docs.forEach((doc) => {
            deleteDoc(doc.ref);
          });
        }
      });
    }
  }

  return { currentSheet, selectSheet, addSheet, deleteCurrentSheet, getSheets, sheets };
};
