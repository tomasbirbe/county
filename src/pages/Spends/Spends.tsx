import React, { useState } from "react";
import {
  Stack,
  Img,
  Text,
  Box,
  Button,
  Input,
  Select,
  Grid,
  GridItem,
  chakra,
  IconButton,
  Icon,
} from "@chakra-ui/react";

import DeleteIcon from "/Icons/delete.svg";
import ArrowUp from "/Icons/arrow-up.svg";
import PlusIcon from "/Icons/plus.svg";

import moneyFormatter from "src/utils/moneyFormatter";
import { KindOfSpend, Spend, Period } from "src/types";

import { useAuthContext } from "src/context/authContext";
import { v4 } from "uuid";
import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "src/firebase/app";
import dayjs from "dayjs";
import { AnimatePresence, isValidMotionProp, motion } from "framer-motion";
import { AiOutlineArrowRight } from "react-icons/ai";

const db = getFirestore(app);
let timer: string | number | NodeJS.Timeout | undefined;

interface Props {
  setCurrentPeriod: React.Dispatch<React.SetStateAction<Period | null>>;
  currentPeriod: Period | null;
}

export const Container = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

export const FormStep = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

export const Spends: React.FC<Props> = ({ setCurrentPeriod, currentPeriod }) => {
  const { user } = useAuthContext();
  const [kindOfSpend, setKindOfSpend] = useState<KindOfSpend>(KindOfSpend.NOINSTALLMENTS);
  const [newDescription, setNewDescription] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [newInstallments, setNewInstallments] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isLastStep, setIsLastStep] = useState(false);
  const [stepForm, setStepForm] = useState(1);

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as KindOfSpend;

    setKindOfSpend(value);
  }

  function addSpend(event: React.FormEvent) {
    event.preventDefault();
    const {
      description,
      amount,
      kind_of_spend: kind,
      installments,
    } = event.target as HTMLFormElement;

    const newSpend: Spend = {
      id: v4(),
      description: description.value,
      amount: amount.value,
      kind: kind.value,
      totalInstallments:
        kind.value !== KindOfSpend.INSTALLMENTS ? null : Number(installments?.value),
      currentInstallment: kind.value !== KindOfSpend.INSTALLMENTS ? null : 1,
      created_at: dayjs().format("YYYY/MM/DD hh:mm:ss"),
    };

    if (currentPeriod) {
      setCurrentPeriod((prevPeriod) => {
        if (prevPeriod) {
          return {
            ...prevPeriod,
            spends: [...prevPeriod.spends, newSpend],
          };
        }

        return null;
      });
      if (user?.email && currentPeriod) {
        updateDoc(doc(db, "users", user.email, "countyData", currentPeriod.id), {
          spends: arrayUnion(newSpend),
        });
      }
    }

    description.value = "";
    amount.value = "";
    kind.value = KindOfSpend.NOINSTALLMENTS;
    setKindOfSpend(KindOfSpend.NOINSTALLMENTS);
    if (installments?.value) {
      installments.value = "";
    }
  }

  function deleteSpend(spend: Spend) {
    if (user?.email && currentPeriod) {
      updateDoc(doc(db, "users", user.email, "countyData", currentPeriod.id), {
        spends: arrayRemove({ ...spend }),
      }).catch((error) => {
        throw new Error(error);
      });
      setCurrentPeriod((prevPeriod) => {
        if (prevPeriod) {
          return {
            ...prevPeriod,
            spends: prevPeriod.spends.filter((spendItem: Spend) => spendItem.id !== spend.id),
          };
        }

        return null;
      });
    }
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

      setCurrentPeriod((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            spends: sortedSpends,
          };
        }

        return null;
      });
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

      setCurrentPeriod((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            spends: sortedSpends,
          };
        }

        return null;
      });
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

  function toggleForm() {
    setShowForm((prevState) => !prevState);
  }

  function nextStep() {
    if (stepForm === 3 && kindOfSpend === KindOfSpend.NOINSTALLMENTS) {
      setIsLastStep(true);
    } else if (stepForm === 4) {
      setIsLastStep(true);
    } else {
      setStepForm((prevState) => prevState + 1);
    }
  }

  function previousStep() {
    if (stepForm > 1) {
      setStepForm((prevState) => prevState - 1);
    }
  }

  return (
    <Container
      key={currentPeriod?.id}
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: "10px", opacity: 0 }}
      maxWidth="full"
      paddingBlockEnd={4}
      paddingBlockStart={6}
      paddingX={0}
      transition={{ ease: "easeInOut" }}
    >
      <Stack align="center" spacing={6}>
        <Stack align="center" spacing={0}>
          <Img height="50px" src={ArrowUp} width="50px" />
          <Text variant="h1/2">{moneyFormatter(totalSpends())}</Text>
        </Stack>
        <Box bg="spend" height="1px" width="40%" />
      </Stack>

      <Box marginInline="auto" paddingBlockStart={8} width="80%">
        <Stack align="center">
          <Button
            _active={{ bg: "secondary.900" }}
            _hover={{ bg: "secondary.500" }}
            bg="secondary.300"
            type="submit"
            variant="add"
          >
            <Img height="20px" marginInlineEnd={2} src={PlusIcon} width="20px" />{" "}
            <Text color="white">Nuevo gasto</Text>
          </Button>
          <Stack
            align="center"
            as="form"
            border="1px solid black"
            marginInlineStart={6}
            paddingBlock={10}
            width="400px"
            onSubmit={addSpend}
          >
            <AnimatePresence>
              {stepForm === 1 && (
                <FormStep
                  alignItems="flex-end"
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-50px", opacity: 0 }}
                  id="step-1"
                  initial={{ x: "50px", opacity: 0 }}
                >
                  <Stack as="label" htmlFor="description" spacing={2}>
                    <Text>Descripcion</Text>
                  </Stack>
                  <Input
                    autoFocus
                    required
                    name="description"
                    placeholder="Notebook"
                    width="400px"
                  />
                </FormStep>
              )}
              {stepForm === 2 && (
                <Stack id="step-2">
                  <Stack as="label" htmlFor="amount" position="relative" spacing={2}>
                    <Text>Gasto</Text>
                    <Stack direction="row" spacing={1}>
                      <Input
                        required
                        min={1}
                        name="amount"
                        placeholder="50000"
                        step="0.01"
                        type="number"
                        width="120px"
                      />
                    </Stack>
                  </Stack>
                </Stack>
              )}
              {stepForm === 3 && (
                <Box id="step-3">
                  <Stack as="label" htmlFor="kind_of_spend">
                    <Text>Tipo de compra</Text>
                    <Select
                      border="1px solid"
                      borderColor="primary.900"
                      height="42px"
                      name="kind_of_spend"
                      width="200px"
                      onChange={handleSelect}
                    >
                      <option value={KindOfSpend.NOINSTALLMENTS}>Efectivo / Debito</option>
                      <option value={KindOfSpend.INSTALLMENTS}>Credito</option>
                    </Select>
                  </Stack>
                </Box>
              )}
              {stepForm === 4 && (
                <Box id="step-4">
                  {kindOfSpend === KindOfSpend.INSTALLMENTS && (
                    <Stack align="center" as="label" htmlFor="installments" spacing={2}>
                      <Text>Cuotas</Text>
                      <Input
                        required
                        min={0}
                        name="installments"
                        placeholder="1"
                        textAlign="center"
                        type="number"
                        width="70px"
                      />
                    </Stack>
                  )}
                </Box>
              )}
            </AnimatePresence>
            <Button
              _active={{ bg: "secondary.900" }}
              _hover={{ bg: "secondary.500" }}
              alignSelf="flex-end"
              bg="secondary.300"
              color="white"
              type="button"
              width="30%"
              onClick={nextStep}
            >
              {isLastStep ? "Finalizar" : <Icon as={AiOutlineArrowRight} />}
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={0}>
          <Grid
            borderBlockEnd="1px solid"
            borderColor="primary.600"
            marginBlockEnd={2}
            paddingBlockEnd={2}
            paddingInline={2}
            templateColumns="repeat(12, 1fr)"
          >
            <GridItem colSpan={7} color="gray.500" fontWeight="600">
              Descripcion
            </GridItem>
            <GridItem colSpan={2} color="gray.500" fontWeight="600" textAlign="center">
              Gasto
            </GridItem>
            <GridItem colSpan={2} color="gray.500" fontWeight="600" textAlign="center">
              Cuota
            </GridItem>
          </Grid>
          {currentPeriod?.spends.map((spend: Spend) => (
            <Grid
              key={spend.id}
              _hover={{ bg: "primary.700" }}
              alignItems="center"
              as="form"
              borderBlockEnd="1px solid black"
              borderColor="primary.600"
              borderRadius="15px"
              className="tableRow"
              paddingBlock={4}
              paddingInline={2}
              templateColumns="repeat(12, 1fr)"
            >
              <>
                <GridItem colSpan={7}>{spend.description}</GridItem>
                <GridItem colSpan={2} textAlign="center">
                  <Stack align="center">
                    <Text textAlign="center">{moneyFormatter(spend.amount)}</Text>
                  </Stack>
                </GridItem>
                <GridItem colSpan={2} textAlign="center">
                  {spend.kind === KindOfSpend.INSTALLMENTS ? (
                    <Stack align="center" direction="row" justify="center">
                      <Button
                        bg="transparent"
                        borderRadius="full"
                        height="32px"
                        minWidth="25px"
                        width="32px"
                        onClick={() => decrementInstallment(spend)}
                      >
                        -
                      </Button>
                      <Text>{`${spend.currentInstallment}/${spend.totalInstallments}`}</Text>
                      <Button
                        bg="transparent"
                        borderRadius="full"
                        height="32px"
                        minWidth="25px"
                        width="32px"
                        onClick={() => incrementInstallment(spend)}
                      >
                        +
                      </Button>
                    </Stack>
                  ) : (
                    "-"
                  )}
                </GridItem>
                <GridItem className="deleteButton" colSpan={1}>
                  <Stack align="center">
                    <Button
                      _active={{ bg: "transparent" }}
                      _hover={{ bg: "white" }}
                      variant="icon"
                      onClick={() => deleteSpend(spend)}
                    >
                      <Img height="25px" src={DeleteIcon} width="25px" />
                    </Button>
                  </Stack>
                </GridItem>
              </>
            </Grid>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};
