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

interface Props {
  currentPeriod: Sheet | null;
  addSpend: (arg01: AddSpendProps) => void;
  deleteSpend: (spend: Spend) => void;
  decrementInstallment: (spend: Spend) => void;
  incrementInstallment: (spend: Spend) => void;
}

export const Spends: React.FC<Props> = ({
  currentPeriod,
  addSpend,
  deleteSpend,
  decrementInstallment,
  incrementInstallment,
}) => {
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
      totalInstallments: totalInstallments ? totalInstallments.value : null,
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
