import { useMemo } from "react";
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
  TableFooter,
  Paper,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import constants from "../../constants";
import formatCurrency from "../../helpers/formatCurrency";
import { Bill, Expense } from "../../models";
import useExpenseQuery from "./useExpenseQuery";
import MonthData from "./MonthData";

const currentMonth = dayjs();

function ResumePage() {
  const accountsAsync = useQuery("bankAccounts", () =>
    fetch(`${constants.URLS.accounts}?type=bank`)
      .then((res) => res.json())
      .then((res) => orderBy(res, ["name"], ["asc"]))
  );

  const billsAsync = useQuery("bills", () => {
    const startOfMonth = currentMonth
      .clone()
      .startOf("month")
      .minute(dayjs().utcOffset())
      .toISOString();
    const endOfMonth = currentMonth
      .clone()
      .endOf("month")
      .minute(dayjs().utcOffset())
      .toISOString();
    return fetch(`${constants.URLS.bills}`)
      .then((res) => res.json())
      .then((res: Array<Bill>) =>
        res
          .map((b) => ({
            ...b,
            init_date: dayjs(b.init_date),
            end_date: dayjs(b.end_date),
          }))
          .filter(
            (b) =>
              b.init_date.isSameOrBefore(startOfMonth) &&
              b.end_date.isSameOrAfter(endOfMonth)
          )
      );
  });

  const expensesAsync = useExpenseQuery(currentMonth);

  const expenses = useMemo(() => {
    if (!expensesAsync.data) return [];
    const result = expensesAsync.data;
    billsAsync.data?.forEach((bill) => {
      if (!result.find((e: Expense) => e.bill_id === bill.id))
        result.push({
          id: bill.id,
          date: dayjs().date(bill.due_day),
          name: bill.name,
          account_id: bill.account_id,
          bill_id: bill.id,
          amount: bill.value,
        });
    });
    return result.sort((a: Expense, b: Expense) => a.date.diff(b.date));
  }, [expensesAsync.data, billsAsync.data]);

  if (accountsAsync.isLoading || expensesAsync.isLoading)
    return <CircularProgress />;
  if (accountsAsync.error || expensesAsync.error)
    return (
      <Alert severity="error">
        {JSON.stringify(accountsAsync.error || expensesAsync.error)}
      </Alert>
    );

  console.log({ expenses });

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
        <MonthData
          currentMonth={currentMonth}
          monthExpenses={expenses}
          accounts={accountsAsync.data || []}
        />
        <TableFooter>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            {accountsAsync.data?.map((account) => (
              <TableCell key={account.id} align="right">
                {formatCurrency(
                  account.balance -
                    sumBy(
                      expenses.filter(
                        (e: Expense) =>
                          !e.confirmed && e.account_id === account.id
                      ),
                      "amount"
                    )
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default ResumePage;
