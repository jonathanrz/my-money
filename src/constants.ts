import { Dayjs } from "dayjs";

const baseURL = "http://localhost:3001";

const generateMonthKey = (key: string) => (date: Dayjs, accountId?: string) => {
  let result = `${key}-${date.year()}-${date.month() + 1}`;
  if (accountId) result = result + "-" + accountId;
  return result;
};

const constants = {
  drawerWidth: 200,
  URLS: {
    accounts: `${baseURL}/accounts`,
    bills: `${baseURL}/bills`,
    categories: `${baseURL}/categories`,
    expenses: `${baseURL}/expenses`,
    buildExpensesUrl: (date: Dayjs, accountId?: string) => {
      let url = `${baseURL}/expenses-${date.year()}-${date.month() + 1}`;
      if (accountId) url = url + `?account_id=${accountId}`;
      return url;
    },
    receipts: `${baseURL}/receipts`,
  },
  reactQueryKeyes: {
    accounts: "accounts",
    bankAccounts: "bankAccounts",
    bills: "bills",
    categories: "categories",
    generateMonthExpenseKey: generateMonthKey("month-expenses"),
    generateExpenseKey: generateMonthKey("expenses"),
    generateBillsKey: generateMonthKey("bills"),
    generateReceiptKey: generateMonthKey("receipts"),
  },

  NUBANK_CC_ID: "7",
  BRADESCO_CC_ID: "8",
  XP_CC_ID: "9",
  CC_IDS: ["7", "8", "9"],
};

export default constants;
