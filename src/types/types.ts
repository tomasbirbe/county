import { KindOfSpend } from "./enums";

export interface Spend {
  id: string;
  description: string;
  kind: KindOfSpend;
  amount: string;
  installments: string;
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
export interface Period {
  id: string;
  name: string;
  spends: Spend[];
  incomes: Income[];
  savings: Saving[];
  created_at: string;
}
