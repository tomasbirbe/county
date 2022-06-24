export default function moneyFormatter(string: string | number) {
  let value = Number(string);

  if (string.toString().slice(0, 1) === "$") {
    const stringWithoutSymbols = string.toString().replace(/[$,.]/gi, "");

    value = Number(stringWithoutSymbols);
  }
  if (!Number.isNaN(value)) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  }

  throw new Error("Invalid value");
}
