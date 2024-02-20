import { Dayjs } from "dayjs";

export type GenerateTransactionFormValues = {
  type: "expense" | "receipt";
  date: Dayjs;
  name: string;
  account_id: string;
  amount: number;
  bill_id?: string;
  category_id?: string;
};
