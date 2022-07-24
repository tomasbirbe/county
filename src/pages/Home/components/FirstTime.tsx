import { Stack, Input, IconButton, Text } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { Container } from "./Container";

interface Props {
  addPeriod: (event: React.FormEvent) => void;
}

export const FirstTime: React.FC<Props> = ({ addPeriod }) => {
  return (
    <Container
      animate={{ y: 0, opacity: 1 }}
      height="calc(100% - 81px)"
      initial={{ y: "10px", opacity: 0 }}
      maxWidth="full"
      paddingBlockStart={10}
      paddingX={0}
      position="relative"
      transition={{ ease: "easeInOut" }}
    >
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
          onSubmit={addPeriod}
        >
          <Input border="none" name="periodInput" placeholder="Abril" />
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