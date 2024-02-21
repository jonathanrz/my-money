import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { groupBy } from "lodash";
import { useMutation, useQueryClient } from "react-query";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useAccountQuery from "../../hooks/useAccountQuery";
import useExpensesQuery from "../../hooks/useExpensesQuery";
import formatCurrency from "../../helpers/formatCurrency";
import constants from "../../constants";

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const accountsAsync = useAccountQuery();
  const expensesAsync = useExpensesQuery(month);

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${constants.URLS.buildExpensesUrl(month)}/${id}`, {
        method: "DELETE",
      });

      queryClient.invalidateQueries({
        queryKey: constants.reactQueryKeyes.generateReceiptKey(month),
      });
    },
  });

  const accounts = useMemo(
    () => groupBy(accountsAsync.data, "id"),
    [accountsAsync.data]
  );

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Day",
      width: 70,
      valueFormatter: (params) => params.value.format("DD/MM"),
    },
    { field: "name", headerName: "Name", width: 350 },
    {
      field: "account_id",
      headerName: "Account",
      width: 130,
      valueFormatter: (params) =>
        accounts[params.value] ? accounts[params.value][0].name : params.value,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 130,
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "id",
      headerName: "Actions",
      type: "number",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => {
            if (confirm("Are you sure?"))
              deleteExpense.mutate(params.value as string);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <DatePicker
        label="Month"
        value={month}
        onChange={(newValue) => setMonth(newValue as Dayjs)}
        format="MM/YY"
      />
      <DataGrid rows={expensesAsync.data || []} columns={columns} />
    </>
  );
}
