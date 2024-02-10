import { orderBy, sumBy } from "lodash";
import { useQuery } from "react-query";
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
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import constants from "../../constants";
import formatCurrency from "../../helpers/formatCurrency";
import { Transaction } from "../../models";
import useExpenseQuery from "./useExpenseQuery";
import MonthData from "./MonthData";

const currentMonth = dayjs();
const nextMonth = dayjs().add(1, "month");

function ResumePage() {
  const accountsAsync = useQuery("bankAccounts", () =>
    fetch(`${constants.URLS.accounts}?type=bank`)
      .then((res) => res.json())
      .then((res) => orderBy(res, ["name"], ["asc"]))
  );

  const expensesAsync = useExpenseQuery(currentMonth);
  const nextMonthExpensesAsync = useExpenseQuery(nextMonth);

  const isLoading =
    accountsAsync.isLoading ||
    expensesAsync.isLoading ||
    nextMonthExpensesAsync.isLoading;
  const error =
    accountsAsync.error || expensesAsync.error || nextMonthExpensesAsync.error;

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
              account.balance -
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
      <Table>
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
            transactions={expensesAsync.transactions || []}
            accounts={accountsAsync.data || []}
          />
          {renderAccountBalanceUpdated(expensesAsync.transactions || [])}
          <MonthData
            transactions={nextMonthExpensesAsync.transactions || []}
            accounts={accountsAsync.data || []}
          />
          {renderAccountBalanceUpdated([
            ...expensesAsync.transactions,
            ...nextMonthExpensesAsync.transactions,
          ])}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResumePage;
