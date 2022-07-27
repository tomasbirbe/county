import { Stack, Box, Input, Select, Button, Text } from "@chakra-ui/react";
import { KindOfSpend } from "src/types";
import { FormModal } from "src/components/Modal";
import { ChangeEvent } from "react";

interface Props {
  handleSubmit: (event: React.FormEvent) => void;
  handleSelect: (event: ChangeEvent<HTMLSelectElement>) => void;
  kindOfSpend: KindOfSpend;
  onClose: () => void;
}

export const CreateSpendForm: React.FC<Props> = ({
  handleSubmit,
  handleSelect,
  kindOfSpend,
  onClose,
}) => {
  return (
    <FormModal title="Agrega un nuevo gasto!" onClose={onClose}>
      <Stack as="form" spacing={8} onSubmit={handleSubmit}>
        <Box>
          <Stack as="label" htmlFor="description" spacing={2}>
            <Text>Descripcion</Text>
          </Stack>
          <Input autoFocus required name="description" placeholder="Notebook" width="280px" />
        </Box>
        <Box>
          <Box as="label" htmlFor="amount">
            <Text>Gasto</Text>
          </Box>

          <Input
            required
            min={1}
            name="amount"
            placeholder="50000"
            step="0.01"
            type="number"
            width="200px"
          />
        </Box>
        <Stack direction="row">
          <Box>
            <Stack as="label" htmlFor="kind_of_spend">
              <Text>Tipo de compra</Text>
            </Stack>
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
          </Box>
          <Box>
            {kindOfSpend === KindOfSpend.INSTALLMENTS && (
              <>
                <Stack align="center" as="label" htmlFor="installments" spacing={2}>
                  <Text>Cuotas</Text>
                </Stack>
                <Input
                  required
                  min={0}
                  name="installments"
                  placeholder="1"
                  textAlign="center"
                  type="number"
                  width="70px"
                />
              </>
            )}
          </Box>
        </Stack>
        <Button
          _active={{ bg: "secondary.900" }}
          _focus={{}}
          _hover={{ bg: "secondary.500" }}
          bg="secondary.300"
          color="white"
          fontWeight="regular"
          type="submit"
        >
          Agregar
        </Button>
      </Stack>
    </FormModal>
  );
};
