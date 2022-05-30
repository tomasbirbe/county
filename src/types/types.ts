import { KindOfSpend } from "./enums";

export interface Spend {
  id: string;
  description: string;
  kind: KindOfSpend;
  amount: string;
  installments: string;
  expirationDate: string;
}
