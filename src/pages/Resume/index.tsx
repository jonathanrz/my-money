import { useState } from "react";
import { orderBy, sumBy } from "lodash";
import { useQuery, useMutation } from "react-query";
import dayjs from "dayjs";
import {
  Alert,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Checkbox,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import constants from "../../constants";
import formatCurrency from "../../helpers/formatCurrency";
import { Account, Transaction } from "../../models";
import useExpenseQuery from "./useExpenseQuery";
import MonthData from "./MonthData";

const ShowConfirmedCheckboxContainer = styled("div")(({ theme }) => ({
  alignItems: "center",
  justifyContent: "flex-end",
  display: "flex",
  gap: theme.spacing(1),
}));

const currentMonth = dayjs();
const nextMonth = dayjs().add(1, "month");

function ResumePage() {
  const [showConfirmed, setShowConfirmed] = useState(false);
  const accountsAsync = useQuery(constants.reactQueryKeyes.bankAccounts, () =>
    fetch(`${constants.URLS.accounts}?type=bank`)
      .then((res) => res.json())
      .then((res) => orderBy(res, ["name"], ["asc"]))
  );

  const confirmTransactionMutation = useMutation({
    mutationFn: async (transaction: Transaction) => {
      const isExpense = transaction.amount < 0;
      const url = isExpense
        ? constants.URLS.buildExpensesUrl(transaction.date)
        : constants.URLS.receipts;
      await fetch(`${url}/${transaction.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmed: !transaction.confirmed }),
      });
      transactionsAsync.refetch();
      nextMonthTransactionsAsync.refetch();
      const account = accountsAsync.data?.find(
        (acc: Account) => acc.id === transaction.account_id
      );
      if (account) {
        let updatedAccountBalance = 0;
        if (transaction.confirmed) {
          updatedAccountBalance = account.balance - transaction.amount;
        } else {
          updatedAccountBalance = account.balance + transaction.amount;
        }
        await fetch(`${constants.URLS.accounts}/${transaction.account_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ balance: updatedAccountBalance }),
        });

        accountsAsync.refetch();
      }
    },
  });

  const transactionsAsync = useExpenseQuery(currentMonth);
  const nextMonthTransactionsAsync = useExpenseQuery(nextMonth);

  const isLoading =
    accountsAsync.isLoading ||
    transactionsAsync.isLoading ||
    nextMonthTransactionsAsync.isLoading;
  const error =
    accountsAsync.error ||
    transactionsAsync.error ||
    nextMonthTransactionsAsync.error;

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{JSON.stringify(error)}</Alert>;

  function renderAccountBalanceUpdated(transactions: Array<Transaction>) {
    return (
      <TableRow>
        <TableCell></TableCell>
        <TableCell></TableCell>
        {accountsAsync.data?.map((account) => (
          <TableCell key={account.id} align="right">
            {formatCurrency(
              account.balance +
                sumBy(
                  transactions.filter(
                    (e: Transaction) =>
                      !e.confirmed && e.account_id === account.id
                  ),
                  "amount"
                )
            )}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            {accountsAsync.data?.map((account) => (
              <TableCell key={account.id} align="right">
                {account.name}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            {accountsAsync.data?.map((account) => (
              <TableCell key={account.id} align="right">
                {formatCurrency(account.balance)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <MonthData
            transactions={(transactionsAsync.transactions || []).filter(
              (e: Transaction) => showConfirmed || !e.confirmed
            )}
            accounts={accountsAsync.data || []}
            confirmTransactionMutation={confirmTransactionMutation}
          />
          {renderAccountBalanceUpdated(transactionsAsync.transactions || [])}
          <MonthData
            transactions={(
              nextMonthTransactionsAsync.transactions || []
            ).filter((e: Transaction) => showConfirmed || !e.confirmed)}
            accounts={accountsAsync.data || []}
            confirmTransactionMutation={confirmTransactionMutation}
          />
          {renderAccountBalanceUpdated([
            ...transactionsAsync.transactions,
            ...nextMonthTransactionsAsync.transactions,
          ])}
        </TableBody>
      </Table>
      <ShowConfirmedCheckboxContainer>
        <Checkbox
          checked={showConfirmed}
          onClick={() => setShowConfirmed(!showConfirmed)}
        />{" "}
        <Typography>Show Confirmed</Typography>
      </ShowConfirmedCheckboxContainer>
    </TableContainer>
  );
}

export default ResumePage;
