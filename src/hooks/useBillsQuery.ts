import { useQuery } from "react-query";
import { orderBy } from "lodash";
import { Bill } from "../models";
import constants from "../constants";

export default function useBillsQuery() {
  return useQuery(constants.reactQueryKeyes.bills, () =>
    fetch(constants.URLS.bills)
      .then((res) => res.json())
      .then((res: Array<Bill>) => orderBy(res, ["name"], ["asc"]))
  );
}
