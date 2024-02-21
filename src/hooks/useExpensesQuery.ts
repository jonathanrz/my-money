import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "react-query";
import constants from "../constants";
import { Expense } from "../models";
import formatExpenseName from "../helpers/formatExpenseName";

export default function useExpensesQuery(month: Dayjs) {
  return useQuery(constants.reactQueryKeyes.generateExpenseKey(month), () => {
    return fetch(constants.URLS.buildExpensesUrl(month))
      .then((res) => res.json())
      .then((res: Array<Expense>) =>
        res
          .map((e) => ({
            ...e,
            date: dayjs(e.date).minute(-dayjs().utcOffset()),
            name: formatExpenseName(e),
          }))
          .sort((a: Expense, b: Expense) => a.date.diff(b.date))
      );
  });
}
