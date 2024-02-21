import { useQuery } from "react-query";
import { orderBy } from "lodash";
import { Category } from "../models";
import constants from "../constants";

export default function useCategoriesQuery() {
  return useQuery(constants.reactQueryKeyes.categories, () =>
    fetch(constants.URLS.categories)
      .then((res) => res.json())
      .then((res: Array<Category>) => orderBy(res, ["name"], ["asc"]))
  );
}
