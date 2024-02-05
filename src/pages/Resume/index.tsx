import { orderBy } from "lodash";
import { useQuery } from "react-query";
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
import numbro from "numbro";
import CircularProgress from "@mui/material/CircularProgress";
import constants from "../../constants";

function ResumePage() {
  const accountsAsync = useQuery("bankAccounts", () =>
    fetch(`${constants.URLS.account}?type=bank`)
      .then((res) => res.json())
      .then((res) => orderBy(res, ["name"], ["asc"]))
  );

  const expensesAsync = useQuery("expense-2024-2", () =>
    fetch(`${constants.URLS.expenses}-2024-2`).then((res) => res.json())
  );

  if (accountsAsync.isLoading || expensesAsync.isLoading)
    return <CircularProgress />;
  if (accountsAsync.error || expensesAsync.error)
    return (
      <Alert severity="error">
        {JSON.stringify(accountsAsync.error || expensesAsync.error)}
      </Alert>
    );

  console.log({ expensesAsync });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {accountsAsync.data?.map((account) => (
              <TableCell key={account.id}>{account.name}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            {accountsAsync.data?.map((account) => (
              <TableCell key={account.id}>
                {numbro(account.balance / 100).formatCurrency({
                  thousandSeparated: true,
                  mantissa: 2,
                })}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {expensesAsync.data?.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResumePage;
