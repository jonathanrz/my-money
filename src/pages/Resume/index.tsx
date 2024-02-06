import { useMemo } from "react";
import { orderBy } from "lodash";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import {
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import constants from "../../constants";
import formatCurrency from "../../helpers/formatCurrency";

const BRADESCO_ACCOUNT_ID = 1;
const NUCONTA_PJ_ACCOUNT_ID = 5;
const NUBANK_CC_ID = 7;
const BRADESCO_CC_ID = 8;
const XP_CC_ID = 9;

type Expense = {
  id: string;
  date: string;
  name: string;
  account: number | string;
  amount: number;
  installment_count: null | number;
  installment_number: null | string;
  installment_uuid: null | string;
  confirmed: boolean;
  nubank_id: string;
};

type AccountMappingAcc = {
  nubank: Array<Expense>;
  bradesco: Array<Expense>;
  xp: Array<Expense>;
  accounts: Array<Expense>;
};

function generateInvoiceExpense(
  expenses: Array<Expense>,
  accountId: number,
  accountName: string
): Expense {
  return {
    id: accountName,
    date: dayjs().startOf("month").toISOString(),
    name: `Invoice ${accountName}`,
    account: accountId,
    amount: expenses.reduce((acc, e) => acc + e.amount, 0),
    installment_count: null,
    installment_number: null,
    installment_uuid: null,
    confirmed: false,
    nubank_id: "",
  };
}

function ResumePage() {
  const accountsAsync = useQuery("bankAccounts", () =>
    fetch(`${constants.URLS.account}?type=bank`)
      .then((res) => res.json())
      .then((res) => orderBy(res, ["name"], ["asc"]))
  );

  const expensesAsync = useQuery("expense-2024-2", () =>
    fetch(`${constants.URLS.expenses}-2024-2`).then((res) => res.json())
  );

  const expenses = useMemo(() => {
    if (!expensesAsync.data) return [];
    const grouped = expensesAsync.data
      .filter((e: Expense) => !e.confirmed)
      .reduce(
        (acc: AccountMappingAcc, expense: Expense) => {
          if (expense.account === NUBANK_CC_ID) acc.nubank.push(expense);
          else if (expense.account === BRADESCO_CC_ID)
            acc.bradesco.push(expense);
          else if (expense.account === XP_CC_ID) acc.xp.push(expense);
          else acc.accounts.push(expense);

          return acc;
        },
        { nubank: [], bradesco: [], xp: [], accounts: [] }
      );
    const result = grouped.accounts;
    if (grouped.nubank.length > 0)
      result.push(
        generateInvoiceExpense(grouped.nubank, NUCONTA_PJ_ACCOUNT_ID, "Nubank")
      );
    if (grouped.bradesco.length > 0)
      result.push(
        generateInvoiceExpense(
          grouped.bradesco,
          BRADESCO_ACCOUNT_ID,
          "Bradesco"
        )
      );
    if (grouped.nubank.length > 0)
      result.push(
        generateInvoiceExpense(grouped.xp, NUCONTA_PJ_ACCOUNT_ID, "XP")
      );
    return result;
  }, [expensesAsync.data]);

  if (accountsAsync.isLoading || expensesAsync.isLoading)
    return <CircularProgress />;
  if (accountsAsync.error || expensesAsync.error)
    return (
      <Alert severity="error">
        {JSON.stringify(accountsAsync.error || expensesAsync.error)}
      </Alert>
    );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {accountsAsync.data?.map((account) => (
              <TableCell key={account.id} align="right">
                {account.name}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            {accountsAsync.data?.map((account) => (
              <TableCell key={account.id} align="right">
                {formatCurrency(account.balance)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense: Expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.name}</TableCell>
              {accountsAsync.data?.map((account) => (
                <TableCell key={account.id} align="right">
                  {account.id == expense.account
                    ? formatCurrency(expense.amount)
                    : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResumePage;
