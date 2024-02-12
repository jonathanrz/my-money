import { UseMutationResult } from "react-query";
import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import formatCurrency from "../../helpers/formatCurrency";
import { Account, Transaction } from "../../models";

const CellContainer = styled("div")(({ theme }) => ({
  cursor: "pointer",
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

function MonthData({
  transactions,
  accounts,
  confirmTransactionMutation,
}: {
  transactions: Array<Transaction>;
  accounts: Array<Account>;
  confirmTransactionMutation: UseMutationResult<
    void,
    unknown,
    Transaction,
    unknown
  >;
}) {
  function renderExpenseAmount(transaction: Transaction) {
    console.log({ transaction });
    const ValueComponent = transaction.amount > 0 ? ReceiptValue : ExpenseValue;
    const Icon = confirmTransactionMutation.isLoading
      ? CircularProgress
      : transaction.confirmed
      ? CloseIcon
      : CheckIcon;
    return (
      <ValueComponent
        sx={{ fontWeight: transaction.confirmed ? "normal" : "bold" }}
      >
        {transaction.billForecast ? (
          <div>{formatCurrency(Math.abs(transaction.amount))}</div>
        ) : (
          <CellContainer
            onClick={() => {
              if (!confirmTransactionMutation.isLoading)
                confirmTransactionMutation.mutate(transaction);
            }}
          >
            <Icon sx={{ width: "16px" }} />
            {formatCurrency(Math.abs(transaction.amount))}
          </CellContainer>
        )}
      </ValueComponent>
    );
  }
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
