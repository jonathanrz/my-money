import { useMemo } from "react";
import { useQuery } from "react-query";
import dayjs, { Dayjs } from "dayjs";
import constants from "../../constants";
import { Bill, Expense } from "../../models";

const NUCONTA_PJ_ACCOUNT_ID = "5";
const NUBANK_CC_ID = "7";
const BRADESCO_CC_ID = "8";
const XP_CC_ID = "9";
const CC_IDS = [NUBANK_CC_ID, BRADESCO_CC_ID, XP_CC_ID];

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

function useExpenseQuery(month: Dayjs) {
  const expensesAsync = useQuery(
    `expense-${month.year()}-${month.month() + 1}`,
    () =>
      fetch(`${constants.URLS.buildExpensesUrl(month)}`)
        .then((res) => res.json())
        .then(async (res) => {
          const result = res
            .filter((e: Expense) => !CC_IDS.includes(e.account_id || ""))
            .map((e: Expense) => ({
              ...e,
              date: dayjs(e.date, { utc: true }).minute(-dayjs().utcOffset()),
            }));

          const lastMonth = month.clone().add(-1, "month");

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

  const billsAsync = useQuery("bills", () => {
    const startOfMonth = month
      .clone()
      .startOf("month")
      .minute(dayjs().utcOffset())
      .toISOString();
    const endOfMonth = month
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
    if (!expensesAsync.data) return [];
    if (!billsAsync.data) return expensesAsync.data;

    const result = [...expensesAsync.data];
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
  }, [expensesAsync.data, billsAsync.data]);

  return {
    isLoading: expensesAsync.isLoading || billsAsync.isLoading,
    error: expensesAsync.error || billsAsync.error,
    data: expenses,
  };
}

export default useExpenseQuery;
