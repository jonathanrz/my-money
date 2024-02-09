import { useMemo } from "react";
import { orderBy, sumBy } from "lodash";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import {
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import constants from "../../constants";
import formatCurrency from "../../helpers/formatCurrency";
import { Bill, Expense } from "../../models";

const NUCONTA_PJ_ACCOUNT_ID = "5";
const NUBANK_CC_ID = "7";
const BRADESCO_CC_ID = "8";
const XP_CC_ID = "9";
const CC_IDS = [NUBANK_CC_ID, BRADESCO_CC_ID, XP_CC_ID];

const currentMonth = dayjs();

const ExpenseConfirmed = styled("div")(({ theme }) => ({
  color: theme.palette.grey[500],
}));

const ExpenseUnConfirmed = styled("div")(({ theme }) => ({
  color: theme.palette.error.light,
}));

function generateInvoiceExpense(
  expenses: Array<Expense>,
  accountId: string,
  accountName: string
): Expense {
  return {
    id: accountName,
    date: dayjs().startOf("month").minute(-dayjs().utcOffset()),
    name: `Invoice ${accountName}`,
    account_id: accountId,
    amount: expenses.reduce((acc, e) => acc + e.amount, 0),
    confirmed: false,
  };
}

function renderExpenseAmount(expense: Expense) {
  const Component = expense.confirmed ? ExpenseConfirmed : ExpenseUnConfirmed;

  return <Component>{formatCurrency(expense.amount)}</Component>;
}

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

  const expensesAsync = useQuery(
    `expense-${currentMonth.year()}-${currentMonth.month() + 1}`,
    () =>
      fetch(`${constants.URLS.buildExpensesUrl(currentMonth)}`)
        .then((res) => res.json())
        .then(async (res) => {
          const result = res
            .filter((e: Expense) => !CC_IDS.includes(e.account_id || ""))
            .map((e: Expense) => ({
              ...e,
              date: dayjs(e.date, { utc: true }).minute(-dayjs().utcOffset()),
            }));

          const lastMonth = currentMonth.clone().add(-1, "month");

          const nubankExpenses = await fetch(
            `${constants.URLS.buildExpensesUrl(
              lastMonth
            )}?account_id=${NUBANK_CC_ID}&confirmed=false`
          ).then((res) => res.json());

          if (nubankExpenses.length > 0) {
            result.push(
              generateInvoiceExpense(
                nubankExpenses,
                NUCONTA_PJ_ACCOUNT_ID,
                "Nubank"
              )
            );
          }
          const xpExpenses = await fetch(
            `${constants.URLS.buildExpensesUrl(
              lastMonth
            )}?account_id=${XP_CC_ID}&confirmed=false`
          ).then((res) => res.json());

          if (xpExpenses.length > 0) {
            result.push(
              generateInvoiceExpense(xpExpenses, NUCONTA_PJ_ACCOUNT_ID, "XP")
            );
          }

          return result;
        })
  );

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
        <TableBody>
          {expenses
            .filter((e: Expense) => !e.confirmed)
            .map((expense: Expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.name}</TableCell>
                <TableCell>{expense.date.date()}</TableCell>
                {accountsAsync.data?.map((account) => (
                  <TableCell key={account.id} align="right" color="primary">
                    {account.id == expense.account_id
                      ? renderExpenseAmount(expense)
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
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
