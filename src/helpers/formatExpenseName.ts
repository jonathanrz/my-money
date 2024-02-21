import { Expense } from "../models";

export default function formatExpenseName(expense: Expense) {
  if (!expense.installment_number) return expense.name;
  return `${expense.name} (${expense.installment_number} de ${expense.installment_count})`;
}
