import React, { useState } from "react";
import { Stack, Text, Box } from "@chakra-ui/react";

import { KindOfSpend, Spend, Sheet, AddSpendProps } from "src/types";

import { useAuthContext } from "src/context/authContext";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "src/firebase/app";

/* ------------------------------- Components ------------------------------- */
import { Container } from "./components/Container";
import { Header } from "./components/Header";
import { CreateSpendButton } from "./components/CreateSpendButton";
import { CreateSpendForm } from "./components/CreateSpendForm";
import { SpendsTable } from "./components/SpendsTable";

const db = getFirestore(app);
let timer: string | number | NodeJS.Timeout | undefined;

interface Props {
  currentPeriod: Sheet | null;
  addSpend: (arg01: AddSpendProps) => void;
  deleteSpend: (spend: Spend) => void;
}

export const Spends: React.FC<Props> = ({ currentPeriod, addSpend, deleteSpend }) => {
  const { user } = useAuthContext();
  const [kindOfSpend, setKindOfSpend] = useState<KindOfSpend>(KindOfSpend.noInstallments);

  const [showForm, setShowForm] = useState(false);

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as KindOfSpend;

    setKindOfSpend(value);
  }

  function createNewSpend(event: React.FormEvent) {
    event.preventDefault();
    const {
      description,
      amount,
      kind_of_spend: kind,
      totalInstallments,
    } = event.target as HTMLFormElement;

    addSpend({
      description: description.value,
      amount: amount.value,
      kind: kind.value,
      totalInstallments: totalInstallments,
    });

    description.value = "";
    amount.value = "";
    kind.value = KindOfSpend.noInstallments;
    setKindOfSpend(KindOfSpend.noInstallments);
    if (totalInstallments?.value) {
      totalInstallments.value = "";
    }
    setShowForm(false);
  }

  function incrementInstallment(spend: Spend) {
    clearTimeout(timer);
    if (currentPeriod?.spends && spend.currentInstallment && spend.totalInstallments) {
      const updateSpend: Spend = {
        ...spend,
        currentInstallment:
          spend.currentInstallment < spend.totalInstallments
            ? spend.currentInstallment + 1
            : spend.currentInstallment,
      };

      const updatedSpends: Spend[] = [
        ...currentPeriod.spends.filter((spendItem) => spendItem.id !== spend.id),
        updateSpend,
      ];

      const sortedSpends = updatedSpends.sort((a, b) => {
        if (new Date(a.created_at) >= new Date(b.created_at)) {
          return 1;
        }

        return -1;
      });

      // setCurrentPeriod((prevState) => {
      //   if (prevState) {
      //     return {
      //       ...prevState,
      //       spends: sortedSpends,
      //     };
      //   }

      //   return null;
      // });
      if (user?.email) {
        const docRef = doc(db, "users", user.email, "countyData", currentPeriod.id);

        timer = setTimeout(() => {
          updateDoc(docRef, {
            spends: sortedSpends,
          });
        }, 1000);
      }
    }
  }

  function decrementInstallment(spend: Spend) {
    clearTimeout(timer);
    if (currentPeriod?.spends && spend.currentInstallment && spend.totalInstallments) {
      const updateSpend: Spend = {
        ...spend,
        currentInstallment:
          spend.currentInstallment > 1 ? spend.currentInstallment - 1 : spend.currentInstallment,
      };

      const updatedSpends: Spend[] = [
        ...currentPeriod.spends.filter((spendItem) => spendItem.id !== spend.id),
        updateSpend,
      ];

      const sortedSpends = updatedSpends.sort((a, b) => {
        if (new Date(a.created_at) >= new Date(b.created_at)) {
          return 1;
        }

        return -1;
      });

      // setCurrentPeriod((prevState) => {
      //   if (prevState) {
      //     return {
      //       ...prevState,
      //       spends: sortedSpends,
      //     };
      //   }

      //   return null;
      // });
      if (user?.email) {
        const docRef = doc(db, "users", user.email, "countyData", currentPeriod.id);

        timer = setTimeout(() => {
          updateDoc(docRef, {
            spends: sortedSpends,
          });
        }, 1000);
      }
    }
  }

  function totalSpends() {
    if (currentPeriod) {
      return currentPeriod.spends.reduce(
        (acc: number, spend: Spend) => acc + Number(spend.amount),
        0,
      );
    }

    return 0;
  }

  function openForm() {
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
  }

  return (
    <Container key={currentPeriod?.id}>
      <Header totalSpends={totalSpends()} />
      <CreateSpendButton handleClick={openForm} />

      <Box marginInline="auto" paddingBlockStart={8} width="80%">
        {showForm && (
          <CreateSpendForm
            handleSelect={handleSelect}
            handleSubmit={createNewSpend}
            kindOfSpend={kindOfSpend}
            onClose={closeForm}
          />
        )}
        {currentPeriod?.spends.length ? (
          <SpendsTable
            decrementInstallment={decrementInstallment}
            deleteSpend={deleteSpend}
            incrementInstallment={incrementInstallment}
            spends={currentPeriod.spends}
          />
        ) : (
          <Stack align="center" paddingBlockStart={6} width="full">
            <Text>Todavia no tenes ningun gasto. Probá crear uno nuevo!</Text>
          </Stack>
        )}
      </Box>
    </Container>
  );
};
