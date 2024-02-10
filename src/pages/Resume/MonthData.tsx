import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import formatCurrency from "../../helpers/formatCurrency";
import { Account, Transaction } from "../../models";

const ExpenseValue = styled("div")(({ theme }) => ({
  color: theme.palette.error.light,
}));

const ReceiptValue = styled("div")(({ theme }) => ({
  color: theme.palette.success.light,
}));

function renderExpenseAmount(expense: Transaction) {
  const ValueComponent = expense.amount > 0 ? ReceiptValue : ExpenseValue;
  return (
    <ValueComponent sx={{ fontWeight: expense.confirmed ? "normal" : "bold" }}>
      {formatCurrency(Math.abs(expense.amount))}
    </ValueComponent>
  );
}

function MonthData({
  transactions,
  accounts,
}: {
  transactions: Array<Transaction>;
  accounts: Array<Account>;
}) {
  return transactions.map((transaction: Transaction) => (
    <TableRow key={transaction.id}>
      <TableCell>{transaction.name}</TableCell>
      <TableCell>{transaction.date.date()}</TableCell>
      {accounts.map((account) => (
        <TableCell key={account.id} align="right" color="primary">
          {account.id == transaction.account_id
            ? renderExpenseAmount(transaction)
            : null}
        </TableCell>
      ))}
    </TableRow>
  ));
}

export default MonthData;
