import React, { useState } from "react";
import {
  arrayRemove,
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
import { KindOfSpend, Sheet, Spend, AddSpendProps, Saving, Income } from "src/types";
import { app } from "src/firebase/app";
import { User } from "firebase/auth";
import { v4 } from "uuid";
import dayjs from "dayjs";
import orderByDate from "src/utils/orderByDate";

const db = getFirestore(app);
let timer: string | number | NodeJS.Timeout | undefined;

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

  const spendsActions = {
    addSpend: ({ description, amount, kind, totalInstallments }: AddSpendProps) => {
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
    },
    deleteSpend: (spend: Spend) => {
      if (user?.email && currentSheet) {
        setCurrentSheet((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              spends: prevState.spends.filter((spendItem: Spend) => spendItem.id !== spend.id),
            };
          }

          return null;
        });

        updateDoc(doc(db, "users", user.email, "countyData", currentSheet.id), {
          spends: arrayRemove({ ...spend }),
        }).catch((error) => {
          throw new Error(error);
        });
      }
    },
    incrementInstallment: (spend: Spend) => {
      clearTimeout(timer);
      if (currentSheet?.spends && spend.currentInstallment && spend.totalInstallments) {
        const updateSpend: Spend = {
          ...spend,
          currentInstallment:
            spend.currentInstallment < spend.totalInstallments
              ? spend.currentInstallment + 1
              : spend.currentInstallment,
        };

        const updatedSpends: Spend[] = [
          ...currentSheet.spends.filter((spendItem) => spendItem.id !== spend.id),
          updateSpend,
        ];

        const sortedSpends = updatedSpends.sort((a, b) => {
          if (new Date(a.created_at) >= new Date(b.created_at)) {
            return 1;
          }

          return -1;
        });

        setCurrentSheet((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              spends: sortedSpends,
            };
          }

          return null;
        });
        if (user?.email) {
          const docRef = doc(db, "users", user.email, "countyData", currentSheet.id);

          timer = setTimeout(() => {
            updateDoc(docRef, {
              spends: sortedSpends,
            });
          }, 1000);
        }
      }
    },
    decrementInstallment: (spend: Spend) => {
      clearTimeout(timer);
      if (currentSheet?.spends && spend.currentInstallment && spend.totalInstallments) {
        const updateSpend: Spend = {
          ...spend,
          currentInstallment:
            spend.currentInstallment > 1 ? spend.currentInstallment - 1 : spend.currentInstallment,
        };

        const updatedSpends: Spend[] = [
          ...currentSheet.spends.filter((spendItem) => spendItem.id !== spend.id),
          updateSpend,
        ];

        const sortedSpends = updatedSpends.sort((a, b) => {
          if (new Date(a.created_at) >= new Date(b.created_at)) {
            return 1;
          }

          return -1;
        });

        setCurrentSheet((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              spends: sortedSpends,
            };
          }

          return null;
        });
        if (user?.email) {
          const docRef = doc(db, "users", user.email, "countyData", currentSheet.id);

          timer = setTimeout(() => {
            updateDoc(docRef, {
              spends: sortedSpends,
            });
          }, 1000);
        }
      }
    },
  };

  const savingsActions = {
    addSaving: (description: string, amount: string) => {
      const newSaving: Saving = {
        id: v4(),
        description: description,
        amount: amount,
        created_at: dayjs().format("YYYY/MM/DD hh:mm:ss"),
      };

      if (user?.email && currentSheet) {
        updateDoc(doc(db, "users", user.email, "countyData", currentSheet.id), {
          savings: arrayUnion(newSaving),
        });

        setCurrentSheet((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              savings: [...prevState.savings, newSaving],
            };
          }

          return null;
        });
      }
    },
    deleteSaving: (saving: Saving) => {
      if (user?.email && currentSheet) {
        updateDoc(doc(db, "users", user.email, "countyData", currentSheet.id), {
          savings: arrayRemove(saving),
        });
        if (currentSheet) {
          setCurrentSheet((prevState) => {
            if (prevState) {
              return {
                ...prevState,
                savings: prevState.savings.filter((savingItem) => savingItem.id !== saving.id),
              };
            }

            return null;
          });
        }
      }
    },
  };

  const incomesActions = {
    addIncome: (description: string, amount: string) => {
      const newIncome: Income = {
        id: v4(),
        description: description,
        amount: amount,
        created_at: dayjs().format("YYYY/MM/DD hh:mm:ss"),
      };

      if (user?.email && currentSheet) {
        updateDoc(doc(db, "users", user.email, "countyData", currentSheet.id), {
          incomes: arrayUnion(newIncome),
        });
        setCurrentSheet((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              incomes: [...prevState.incomes, newIncome],
            };
          }

          return null;
        });
      }
    },

    deleteIncome: (income: Income) => {
      if (user?.email && currentSheet) {
        updateDoc(doc(db, "users", user.email, "countyData", currentSheet.id), {
          incomes: arrayRemove(income),
        });

        setCurrentSheet((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              incomes: prevState.incomes.filter((incomeItem) => incomeItem.id !== income.id),
            };
          }

          return null;
        });
      }
    },
  };

  return {
    currentSheet,
    selectSheet,
    addSheet,
    spendsActions,
    savingsActions,
    incomesActions,
    deleteCurrentSheet,
    getSheets,
    sheets,
  };
};
