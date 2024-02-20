import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "react-query";
import constants from "../constants";
import { Receipt } from "../models";

export default function useReceiptsQuery(month: Dayjs) {
  return useQuery(constants.reactQueryKeyes.generateReceiptKey(month), () => {
    const startOfMonth = month
      .clone()
      .startOf("month")
      .minute(dayjs().utcOffset());
    const endOfMonth = month.clone().endOf("month").minute(dayjs().utcOffset());

    return fetch(`${constants.URLS.receipts}`)
      .then((res) => res.json())
      .then((res: Array<Receipt>) =>
        res
          .map((r) => ({
            ...r,
            date: dayjs(r.date),
          }))
          .filter(
            (r) =>
              r.date.isSameOrAfter(startOfMonth) &&
              r.date.isSameOrBefore(endOfMonth)
          )
          .sort((a: Receipt, b: Receipt) => a.date.diff(b.date))
      );
  });
}
