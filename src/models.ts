import { Dayjs } from "dayjs";

export type Bill = {
  account_id: string;
  category_id: string;
  due_day: number;
  end_date: string | Dayjs;
  id: string;
  init_date: string | Dayjs;
  name: string;
  value: number;
};

export type Expense = {
  id: string;
  date: Dayjs;
  name: string;
  account_id?: string;
  bill_id?: string;
  amount: number;
  installment_count?: number;
  installment_number?: string;
  installment_uuid?: string;
  confirmed: boolean;
  nubank_id?: string;
};
