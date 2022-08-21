import { Stack, Grid, GridItem, Button, Img, Text } from "@chakra-ui/react";
import moneyFormatter from "src/utils/moneyFormatter";
import { KindOfSpend, Spend } from "src/types";
import DeleteIcon from "/Icons/delete.svg";

interface Props {
  spends: Spend[];
  decrementInstallment: (spend: Spend) => void;
  incrementInstallment: (spend: Spend) => void;
  deleteSpend: (spend: Spend) => void;
}

export const SpendsTable: React.FC<Props> = ({
  spends,
  decrementInstallment,
  incrementInstallment,
  deleteSpend,
}) => {
  return (
    <Stack direction="row" spacing={10}>
      <Stack spacing={0} width="full">
        <Grid
          borderBlockEnd="1px solid"
          borderColor="primary.600"
          marginBlockEnd={2}
          paddingBlockEnd={2}
          paddingInline={2}
          templateColumns="repeat(12, 1fr)"
        >
          <GridItem colSpan={6} color="gray.500" fontWeight="600">
            Descripcion
          </GridItem>
          <GridItem colSpan={3} color="gray.500" fontWeight="600" textAlign="center">
            Gasto
          </GridItem>
          <GridItem colSpan={2} color="gray.500" fontWeight="600" textAlign="center">
            Cuota
          </GridItem>
        </Grid>
        {spends.map((spend: Spend) => (
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
            <GridItem colSpan={6}>{spend.description}</GridItem>
            <GridItem colSpan={3} textAlign="center">
              <Stack align="center">
                <Text textAlign="center">{moneyFormatter(spend.amount)}</Text>
              </Stack>
            </GridItem>
            <GridItem colSpan={2} textAlign="center">
              {spend.kind === KindOfSpend.hasInstallments ? (
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
          </Grid>
        ))}
      </Stack>
    </Stack>
  );
};
