import { useQuery } from "react-query";
import dayjs, { Dayjs } from "dayjs";
import constants from "../../constants";
import { Expense } from "../../models";

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
  return useQuery(`expense-${month.year()}-${month.month() + 1}`, () =>
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
}

export default useExpenseQuery;
