import { Dayjs } from "dayjs";

export type GenerateBillExpenseFormValues = {
  date: Dayjs;
  name: string;
  account_id: string;
  amount: number;
  bill_id: string;
};
