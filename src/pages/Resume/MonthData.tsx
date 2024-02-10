import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import formatCurrency from "../../helpers/formatCurrency";
import { Account, Expense } from "../../models";

const ExpenseConfirmed = styled("div")(({ theme }) => ({
  color: theme.palette.grey[500],
}));

const ExpenseUnConfirmed = styled("div")(({ theme }) => ({
  color: theme.palette.error.light,
}));

function renderExpenseAmount(expense: Expense) {
  const Component = expense.confirmed ? ExpenseConfirmed : ExpenseUnConfirmed;

  return <Component>{formatCurrency(expense.amount)}</Component>;
}

function MonthData({
  monthExpenses,
  accounts,
}: {
  monthExpenses: Array<Expense>;
  accounts: Array<Account>;
}) {
  return monthExpenses
    .filter((e: Expense) => !e.confirmed)
    .map((expense: Expense) => (
      <TableRow key={expense.id}>
        <TableCell>{expense.name}</TableCell>
        <TableCell>{expense.date.date()}</TableCell>
        {accounts.map((account) => (
          <TableCell key={account.id} align="right" color="primary">
            {account.id == expense.account_id
              ? renderExpenseAmount(expense)
              : null}
          </TableCell>
        ))}
      </TableRow>
    ));
}

export default MonthData;
