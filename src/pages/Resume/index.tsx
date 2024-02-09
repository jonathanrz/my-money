import { orderBy, sumBy } from "lodash";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import {
  Alert,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import constants from "../../constants";
import formatCurrency from "../../helpers/formatCurrency";
import { Expense } from "../../models";
import useExpenseQuery from "./useExpenseQuery";
import MonthData from "./MonthData";

const currentMonth = dayjs();

function ResumePage() {
  const accountsAsync = useQuery("bankAccounts", () =>
    fetch(`${constants.URLS.accounts}?type=bank`)
      .then((res) => res.json())
      .then((res) => orderBy(res, ["name"], ["asc"]))
  );

  const expensesAsync = useExpenseQuery(currentMonth);

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
            <TableCell></TableCell>
            {accountsAsync.data?.map((account) => (
              <TableCell key={account.id} align="right">
                {account.name}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            {accountsAsync.data?.map((account) => (
              <TableCell key={account.id} align="right">
                {formatCurrency(account.balance)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <MonthData
          currentMonth={currentMonth}
          monthExpenses={expensesAsync.data || []}
          accounts={accountsAsync.data || []}
        />
        <TableFooter>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            {accountsAsync.data?.map((account) => (
              <TableCell key={account.id} align="right">
                {formatCurrency(
                  account.balance -
                    sumBy(
                      expensesAsync.data?.filter(
                        (e: Expense) =>
                          !e.confirmed && e.account_id === account.id
                      ),
                      "amount"
                    )
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default ResumePage;
