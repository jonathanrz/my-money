import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useMutation, useQueryClient } from "react-query";
import { Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GridColDef } from "@mui/x-data-grid";
import useExpensesQuery from "../../hooks/useExpensesQuery";
import formatCurrency from "../../helpers/formatCurrency";
import constants from "../../constants";
import { Expense } from "../../models";
import ExpensesForm from "./ExpensesForm";
import CrudTable, {
  GenerateColumnsProps,
  GenerateFormProps,
} from "../../components/CrudTable";

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const expensesAsync = useExpensesQuery(month);

  async function updateExpense(expense: Expense) {
    let url = constants.URLS.buildExpensesUrl(expense.date);
    if (expense.id) url += `/${expense.id}`;
    await fetch(url, {
      method: expense.id ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });

    queryClient.invalidateQueries({
      queryKey: constants.reactQueryKeyes.generateExpenseKey(expense.date),
    });
  }

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${constants.URLS.buildExpensesUrl(month)}/${id}`, {
        method: "DELETE",
      });

      queryClient.invalidateQueries({
        queryKey: constants.reactQueryKeyes.generateExpenseKey(month),
      });
    },
  });

  function generateColumns({
    accounts,
    bills,
    categories,
    setEditData,
  }: GenerateColumnsProps) {
    return [
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
          accounts[params.value] ? accounts[params.value].name : params.value,
      },
      {
        field: "bill_id",
        headerName: "Bill",
        width: 130,
        valueFormatter: (params) =>
          bills[params.value] ? bills[params.value].name : params.value,
      },
      {
        field: "category_id",
        headerName: "Category",
        width: 130,
        valueFormatter: (params) =>
          categories[params.value]
            ? categories[params.value].name
            : params.value,
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
        width: 250,
        renderCell: (params) => (
          <>
            <Box marginRight={2}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditData(params.row as Expense)}
              >
                Edit
              </Button>
            </Box>
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
          </>
        ),
      },
    ] as GridColDef[];
  }

  function generateForm({ dataToEdit, onDataUpdated }: GenerateFormProps) {
    return (
      <ExpensesForm
        expense={dataToEdit}
        onSubmit={(formData) => {
          updateExpense(formData).then(() => onDataUpdated());
        }}
      />
    );
  }

  return (
    <>
      <DatePicker
        label="Month"
        value={month}
        onChange={(newValue) => setMonth(newValue as Dayjs)}
        format="MM/YY"
      />
      <CrudTable
        generateColumns={generateColumns}
        generateForm={generateForm}
        rows={expensesAsync.data || []}
      />
    </>
  );
}
