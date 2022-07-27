import { Stack, Button, Img, Text } from "@chakra-ui/react";

import PlusIcon from "/Icons/plus.svg";

interface Props {
  handleClick: () => void;
}

export const CreateSpendButton: React.FC<Props> = ({ handleClick }) => {
  return (
    <Stack align="center" justify="center" paddingBlock={6} position="sticky" top="-5px">
      <Button
        _active={{ bg: "secondary.900" }}
        _hover={{ bg: "secondary.500" }}
        bg="secondary.300"
        type="submit"
        onClick={handleClick}
      >
        <Img height="20px" marginInlineEnd={2} src={PlusIcon} width="20px" />{" "}
        <Text color="white">Nuevo gasto</Text>
      </Button>
    </Stack>
  );
};
