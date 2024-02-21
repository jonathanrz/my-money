import { useQuery } from "react-query";
import { orderBy } from "lodash";
import dayjs from "dayjs";
import { Bill } from "../models";
import constants from "../constants";

export default function useBillsQuery() {
  return useQuery(constants.reactQueryKeyes.bills, () =>
    fetch(constants.URLS.bills)
      .then((res) => res.json())
      .then((res: Array<Bill>) =>
        orderBy(
          res.map((r) => ({
            ...r,
            init_date: dayjs(r.init_date),
            end_date: dayjs(r.end_date),
          })),
          ["name"],
          ["asc"]
        )
      )
  );
}
