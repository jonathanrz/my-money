import { Dayjs } from "dayjs";

const baseURL = "http://localhost:3001";

const constants = {
  drawerWidth: 200,
  URLS: {
    accounts: `${baseURL}/accounts`,
    bills: `${baseURL}/bills`,
    expenses: `${baseURL}/expenses`,
    buildExpensesUrl: (date: Dayjs) =>
      `${baseURL}/expenses-${date.year()}-${date.month() + 1}`,
    receipts: `${baseURL}/receipts`,
  },
};

export default constants;
