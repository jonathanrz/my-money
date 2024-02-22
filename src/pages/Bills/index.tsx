import { useMutation, useQueryClient } from "react-query";
import { Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GridColDef } from "@mui/x-data-grid";
import useBillsQuery from "../../hooks/useBillsQuery";
import formatCurrency from "../../helpers/formatCurrency";
import constants from "../../constants";
import type { Bill } from "../../models";
import BillForm from "./BillForm";
import CrudTable, {
  GenerateColumnsProps,
  GenerateFromProps,
} from "../../components/CrudTable";

export default function BillsPage() {
  const queryClient = useQueryClient();
  const billsAsync = useBillsQuery();

  async function updateBill(bill: Bill) {
    let url = constants.URLS.bills;
    if (bill.id) url += `/${bill.id}`;
    await fetch(url, {
      method: bill.id ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bill),
    });

    queryClient.invalidateQueries({
      queryKey: constants.reactQueryKeyes.bills,
    });
  }

  const deleteBill = useMutation({
    mutationFn: (id: string) =>
      fetch(`${constants.URLS.bills}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: constants.reactQueryKeyes.bills,
      }),
  });

  function generateColumns({
    accounts,
    categories,
    setEditData,
  }: GenerateColumnsProps) {
    return [
      {
        field: "init_date",
        headerName: "Init Date",
        width: 100,
        valueFormatter: (params) => params.value.format("DD/MM/YY"),
      },
      {
        field: "end_date",
        headerName: "End Date",
        width: 100,
        valueFormatter: (params) => params.value.format("DD/MM/YY"),
      },
      { field: "name", headerName: "Name", width: 300 },
      {
        field: "account_id",
        headerName: "Account",
        width: 130,
        valueFormatter: (params) =>
          accounts[params.value] ? accounts[params.value].name : params.value,
      },
      {
        field: "category_id",
        headerName: "Category",
        width: 200,
        valueFormatter: (params) =>
          categories[params.value]
            ? categories[params.value].name
            : params.value,
      },
      {
        field: "value",
        headerName: "Value",
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
                onClick={() => setEditData(params.row as Bill)}
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
                  deleteBill.mutate(params.value as string);
              }}
            >
              Delete
            </Button>
          </>
        ),
      },
    ] as GridColDef[];
  }

  function generateForm({ dataToEdit, onDataUpdated }: GenerateFromProps) {
    return (
      <BillForm
        bill={dataToEdit}
        onSubmit={(formData) => {
          updateBill(formData).then(() => onDataUpdated());
        }}
      />
    );
  }

  return (
    <CrudTable
      generateColumns={generateColumns}
      generateForm={generateForm}
      rows={billsAsync.data || []}
    />
  );
}
