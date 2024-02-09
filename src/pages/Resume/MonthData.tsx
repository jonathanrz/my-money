import { useMemo } from "react";
import { useQuery } from "react-query";
import dayjs, { Dayjs } from "dayjs";
import { TableBody, TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import constants from "../../constants";
import formatCurrency from "../../helpers/formatCurrency";
import { Account, Bill, Expense } from "../../models";

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
  currentMonth,
  monthExpenses,
  accounts,
}: {
  currentMonth: Dayjs;
  monthExpenses: Array<Expense>;
  accounts: Array<Account>;
}) {
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

  const expenses = useMemo(() => {
    const result = [...monthExpenses];
    billsAsync.data?.forEach((bill) => {
      if (!result.find((e: Expense) => e.bill_id === bill.id))
        result.push({
          id: bill.id,
          date: dayjs().date(bill.due_day),
          name: bill.name,
          account_id: bill.account_id,
          bill_id: bill.id,
          amount: bill.value,
          confirmed: false,
        });
    });
    return result.sort((a: Expense, b: Expense) => a.date.diff(b.date));
  }, [monthExpenses, billsAsync.data]);

  return (
    <TableBody>
      {expenses
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
        ))}
    </TableBody>
  );
}

export default MonthData;
