import { KindOfSpend } from "./enums";

export interface Spend {
  id: string;
  description: string;
  kind: KindOfSpend;
  amount: string;
  currentInstallment: number | null;
  totalInstallments: number | null;
  created_at: string;
}
export interface Saving {
  id: string;
  description: string;
  amount: string;
  created_at: string;
  // Goal is a future feauture
  // goal: string;
}
export interface Income {
  id: string;
  description: string;
  amount: string;
  created_at: string;
}
export interface Sheet {
  id: string;
  name: string;
  spends: Spend[];
  incomes: Income[];
  savings: Saving[];
  created_at: string;
}

export interface AddSpendProps {
  description: string;
  amount: string;
  kind: KindOfSpend;
  totalInstallments?: number;
}
