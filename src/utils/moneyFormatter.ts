export default function moneyFormatter(string: string | number) {
  const value = Number(string);

  if (value >= 0) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  }

  throw new Error("Invalid value");
}
