import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useMutation, useQueryClient } from "react-query";
import { Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GridColDef } from "@mui/x-data-grid";
import useReceiptsQuery from "../../hooks/useReceiptsQuery";
import formatCurrency from "../../helpers/formatCurrency";
import constants from "../../constants";
import { Receipt } from "../../models";
import CrudTable, {
  GenerateColumnsProps,
  GenerateFormProps,
} from "../../components/CrudTable";
import ReceiptsForm from "./ReceiptsForm";

export default function ReceiptsPage() {
  const queryClient = useQueryClient();
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const receiptsAsync = useReceiptsQuery(month);

  async function updateReceipt(receipt: Receipt) {
    let url = constants.URLS.receipts;
    if (receipt.id) url += `/${receipt.id}`;
    await fetch(url, {
      method: receipt.id ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(receipt),
    });

    queryClient.invalidateQueries({
      queryKey: constants.reactQueryKeyes.generateReceiptKey(receipt.date),
    });
  }

  const deleteReceipt = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${constants.URLS.receipts}/${id}`, {
        method: "DELETE",
      });

      queryClient.invalidateQueries({
        queryKey: constants.reactQueryKeyes.generateReceiptKey(month),
      });
    },
  });

  function generateColumns({ accounts, setEditData }: GenerateColumnsProps) {
    return [
      {
        field: "date",
        headerName: "Day",
        width: 70,
        valueFormatter: (params) => params.value.format("DD/MM"),
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
                  deleteReceipt.mutate(params.value as string);
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
      <ReceiptsForm
        receipt={dataToEdit}
        onSubmit={(formData) => {
          updateReceipt(formData).then(() => onDataUpdated());
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
        rows={receiptsAsync.data || []}
      />
    </>
  );
}
