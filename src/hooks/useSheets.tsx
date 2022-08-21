import React, { useState } from "react";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { KindOfSpend, Sheet, Spend, AddSpendProps } from "src/types";
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

  function addSpend({ description, amount, kind, totalInstallments }: AddSpendProps) {
    const newSpend: Spend = {
      id: v4(),
      description: description,
      amount: amount,
      kind: kind,
      totalInstallments: kind === KindOfSpend.hasInstallments ? Number(totalInstallments) : null,
      currentInstallment: kind == KindOfSpend.hasInstallments ? 1 : null,
      created_at: dayjs().format("YYYY/MM/DD hh:mm:ss"),
    };

    if (currentSheet) {
      setCurrentSheet((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            spends: [...prevState.spends, newSpend],
          };
        }

        return null;
      });
      if (user?.email && currentSheet) {
        updateDoc(doc(db, "users", user.email, "countyData", currentSheet.id), {
          spends: arrayUnion(newSpend),
        });
      }
    }
  }

  return { currentSheet, selectSheet, addSheet, addSpend, deleteCurrentSheet, getSheets, sheets };
};
