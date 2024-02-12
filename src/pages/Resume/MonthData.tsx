import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import formatCurrency from "../../helpers/formatCurrency";
import { Account, Transaction } from "../../models";

const CellContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: theme.spacing(0.5),
}));

const ExpenseValue = styled("div")(({ theme }) => ({
  color: theme.palette.error.light,
}));

const ReceiptValue = styled("div")(({ theme }) => ({
  color: theme.palette.success.light,
}));

function renderExpenseAmount(expense: Transaction) {
  const ValueComponent = expense.amount > 0 ? ReceiptValue : ExpenseValue;
  const Icon = expense.confirmed ? CloseIcon : CheckIcon;
  return (
    <ValueComponent sx={{ fontWeight: expense.confirmed ? "normal" : "bold" }}>
      <CellContainer>
        <Icon sx={{ width: "16px" }} />
        {formatCurrency(Math.abs(expense.amount))}
      </CellContainer>
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
