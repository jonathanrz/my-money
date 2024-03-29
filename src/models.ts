import { Dayjs } from "dayjs";

export type Account = {
  balance: number;
  id: string;
  name: string;
  type: string;
};

export type Bill = {
  account_id: string;
  category_id: string;
  due_day: number;
  end_date: string | Dayjs;
  id?: string;
  init_date: string | Dayjs;
  name: string;
  value: number;
};

export type Category = {
  display_in_month_expense: boolean;
  forecast: number;
  id?: string;
  name: string;
};

export type Expense = {
  id?: string;
  date: Dayjs;
  name: string;
  account_id?: string;
  bill_id?: string;
  category_id?: string;
  amount: number;
  installment_count?: number;
  installment_number?: string;
  installment_uuid?: string;
  confirmed: boolean;
  nubank_id?: string;
  billForecast: boolean;
};

export type Transaction = {
  id: string;
  date: Dayjs;
  name: string;
  account_id: string;
  confirmed: boolean;
  amount: number;
  bill_id?: string;
  billForecast: boolean;
};

export type Receipt = {
  id?: string;
  date: Dayjs;
  name: string;
  account_id: string;
  confirmed: boolean;
  amount: number;
};
