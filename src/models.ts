export type Expense = {
  id: string;
  date: string;
  name: string;
  account_id: null | string;
  bill_id: null | string;
  amount: number;
  installment_count: null | number;
  installment_number: null | string;
  installment_uuid: null | string;
  confirmed: boolean;
  nubank_id: string;
};
