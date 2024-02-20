import { Dayjs } from "dayjs";

const baseURL = "http://localhost:3001";

const generateMonthKey = (key: string) => (date: Dayjs) =>
  `${key}-${date.year()}-${date.month() + 1}`;

const constants = {
  drawerWidth: 200,
  URLS: {
    accounts: `${baseURL}/accounts`,
    bills: `${baseURL}/bills`,
    categories: `${baseURL}/categories`,
    expenses: `${baseURL}/expenses`,
    buildExpensesUrl: (date: Dayjs) =>
      `${baseURL}/expenses-${date.year()}-${date.month() + 1}`,
    receipts: `${baseURL}/receipts`,
  },
  reactQueryKeyes: {
    accounts: "accounts",
    bankAccounts: "bankAccounts",
    bills: "bills",
    categories: "categories",
    generateExpenseKey: generateMonthKey("expenses"),
    generateBillsKey: generateMonthKey("bills"),
    generateReceiptKey: generateMonthKey("receipts"),
  },
};

export default constants;
