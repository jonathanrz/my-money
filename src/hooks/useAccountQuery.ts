import { useQuery } from "react-query";
import { orderBy } from "lodash";
import { Account } from "../models";
import constants from "../constants";

export default function useAccountQuery() {
  return useQuery(constants.reactQueryKeyes.accounts, () =>
    fetch(constants.URLS.accounts)
      .then((res) => res.json())
      .then((res: Array<Account>) => orderBy(res, ["name"], ["asc"]))
  );
}
