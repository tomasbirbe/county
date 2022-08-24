import {
  Box,
  Button,
  chakra,
  Divider,
  Icon,
  IconButton,
  Img,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import moneyFormatter from "src/utils/moneyFormatter";
import { BsCalendar } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";

import Pocket from "/Icons/pocket.svg";
import { Sheet } from "src/types";
import { AnimatePresence, isValidMotionProp, motion } from "framer-motion";
import { Portal } from "src/components/Portal";
import { NavLink } from "./components/NavLink";

interface Props {
  remaining: number;
  sheets: Sheet[];
  currentSheet: Sheet | null;
  addSheet: (arg01: string) => void;
  selectSheet: (arg01: Sheet) => void;
}

const SideMenu = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

export const Layout: React.FC<Props> = ({
  remaining,
  sheets,
  addSheet,
  currentSheet,
  selectSheet,
}) => {
  const [showPeriods, setShowPeriods] = useState<boolean>(false);

  function togglePeriods() {
    setShowPeriods((prevState: boolean) => !prevState);
  }

  function createNewSheet(event: React.FormEvent) {
    event.preventDefault();
    const { newSheetInput } = event.target as HTMLFormElement;

    addSheet(newSheetInput);
  }

  function changePeriod(sheet: Sheet) {
    selectSheet(sheet);
    setShowPeriods(false);
  }

  return (
    <>
      <Stack align="center" as="nav" bg="white" spacing={0} width="full">
        <Stack
          align="center"
          direction="row"
          height="70px"
          justify="space-between"
          paddingInline={6}
          width="full"
        >
          <Box width="150px">
            <Text fontWeight="700">County</Text>
          </Box>
          <Stack align="center" as="ul" direction="row" height="full" spacing={8}>
            <NavLink to="/">Resumen</NavLink>
            <NavLink to="/spends" underlineColor="spend">
              Gastos
            </NavLink>
            <NavLink to="/savings" underlineColor="saving">
              Ahorros
            </NavLink>
            <NavLink to="/incomes" underlineColor="income">
              Ingresos
            </NavLink>
          </Stack>
          <Stack direction="row" justify="flex-end" width="150px">
            <Img height="30px" loading="eager" src={Pocket} width="30px" />
            <Text color="secondary.100">{moneyFormatter(remaining)}</Text>
          </Stack>
        </Stack>
        <Divider color="black" />
        {currentSheet && (
          <>
            <Stack align="center" height="35px" justify="center" width="full">
              <Text>{currentSheet.name}</Text>
            </Stack>
            <Divider color="black" />
          </>
        )}
      </Stack>
      <Portal>
        {currentSheet && (
          <IconButton
            aria-label="Close side menu"
            bg="white"
            borderInlineEndRadius="full"
            boxShadow="sm-white"
            height="50px"
            icon={<Icon as={BsCalendar} boxSize={5} marginInlineEnd={1} />}
            left="0px"
            minWidth="30px"
            position="fixed"
            top="50%"
            width="40px"
            onClick={togglePeriods}
          />
        )}
      </Portal>

      {/* -------------------------------- Side menu ------------------------------- */}
      <Portal>
        <AnimatePresence>
          {showPeriods && (
            <SideMenu
              animate={{ x: "0px" }}
              bg="white"
              boxShadow="sm-white"
              exit={{ x: "-340px" }}
              height="full"
              initial={{ x: "-300px" }}
              justifyContent="space-between"
              left="0"
              position="fixed"
              top="0"
              transition={{ ease: "easeInOut", duration: "0.3" }}
              width="300px"
            >
              <Stack height="full" position="relative" spacing={0}>
                <IconButton
                  aria-label="Close side menu"
                  bg="white"
                  borderInlineEndRadius="full"
                  boxShadow="sm-white"
                  height="50px"
                  icon={<Icon as={IoIosArrowBack} boxSize={5} marginInlineEnd={1} />}
                  minWidth="30px"
                  position="absolute"
                  right="-40px"
                  top="50%"
                  width="40px"
                  onClick={togglePeriods}
                />

                <Stack align="center" height="full" paddingBlock={4} spacing={3}>
                  <Stack
                    align="center"
                    as="form"
                    border="1px solid"
                    borderColor="blackAlpha.400"
                    borderRadius="4px"
                    direction="row"
                    width="90%"
                    onSubmit={createNewSheet}
                  >
                    <Input
                      border="none"
                      id="newSheetInput"
                      name="newSheetInput"
                      placeholder="Abril"
                    />
                    <IconButton
                      aria-label="Add new period"
                      bg="transparent"
                      height="30px"
                      icon={<AiOutlinePlus />}
                      minWidth="30px"
                      type="submit"
                    />
                  </Stack>
                  <Box bg="blackAlpha.400" height="1px" width="90%" />
                  <Stack
                    align="center"
                    as="ul"
                    bg="transparent"
                    height="full"
                    overflow="auto"
                    paddingInline={4}
                    spacing={2}
                    width="full"
                  >
                    {sheets.map((sheet) => (
                      <Button
                        key={sheet.id}
                        as="li"
                        bg="transparent"
                        paddingBlock={4}
                        width="90%"
                        onClick={() => changePeriod(sheet)}
                      >
                        {sheet.name}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </SideMenu>
          )}
        </AnimatePresence>
      </Portal>
      <Outlet />
    </>
  );
};
