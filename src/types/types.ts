import { KindOfSpend } from "./enums";

export interface Spend {
  id: string;
  description: string;
  kind: KindOfSpend;
  amount: string;
  installments: string;
  firstInstallment: string;
}
export interface Saving {
  id: string;
  description: string;
  amount: string;
}
export interface Income {
  id: string;
  description: string;
  amount: string;
}
