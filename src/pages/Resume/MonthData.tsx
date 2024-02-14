import { useState } from "react";
import { UseMutationResult } from "react-query";
import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import formatCurrency from "../../helpers/formatCurrency";
import { Account, Transaction } from "../../models";
import GenerateBillExpenseDialog from "./GenerateBillExpenseDialog";

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
  const [billToGenerateExpense, setBillToGenerateExpense] =
    useState<Transaction | null>(null);

  function renderExpenseAmount(transaction: Transaction) {
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
          <CellContainer
            onClick={() => {
              setBillToGenerateExpense({
                ...transaction,
                amount: -transaction.amount,
              });
            }}
          >
            <AddIcon sx={{ width: "16px" }} />
            {formatCurrency(Math.abs(transaction.amount))}
          </CellContainer>
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
      {billToGenerateExpense && (
        <GenerateBillExpenseDialog
          transaction={billToGenerateExpense}
          handleClose={() => setBillToGenerateExpense(null)}
        />
      )}
    </TableRow>
  ));
}

export default MonthData;
