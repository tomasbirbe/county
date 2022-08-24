import { Stack, Input, IconButton, Text, Box } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { SignOutButton } from "src/components/SignOutButton";
import { v4 } from "uuid";
import { Container } from "./Container";

interface Props {
  addPeriod: (arg01: string) => void;
}

const id = v4();

export const FirstTime: React.FC<Props> = ({ addPeriod }) => {
  function createNewSheet(event: React.FormEvent) {
    event.preventDefault();
    const { sheetNameInput } = event.target as HTMLFormElement;

    if (sheetNameInput.value) {
      addPeriod(sheetNameInput.value);
    } else {
      console.log("Debes ingresar un nombre valido");
    }
  }

  return (
    <Container key={id}>
      <Box position="absolute" right="20px" top="15px">
        <SignOutButton />
      </Box>
      <Stack
        align="center"
        height="full"
        justify="center"
        margin="auto"
        spacing={6}
        textAlign="center"
        width="500px"
      >
        <Text fontSize={40} fontWeight="bold" lineHeight={0.5}>
          Hola!
        </Text>
        <Text>Probá crear una nueva hoja para utilizar County</Text>
        <Stack
          align="center"
          as="form"
          border="1px solid"
          borderColor="blackAlpha.400"
          borderRadius="4px"
          direction="row"
          paddingInline={1}
          width="40%"
          onSubmit={createNewSheet}
        >
          <Input border="none" name="sheetNameInput" placeholder="Abril" />
          <IconButton
            aria-label="Add new period"
            bg="transparent"
            height="30px"
            icon={<AiOutlinePlus />}
            minWidth="30px"
            type="submit"
          />
        </Stack>
      </Stack>
    </Container>
  );
};
