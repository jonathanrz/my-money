import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Select, MenuItem, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useExpensesQuery from "../../hooks/useExpensesQuery";
import formatCurrency from "../../helpers/formatCurrency";
import constants from "../../constants";

const Container = styled("div")({
  display: "flex",
  gap: 50,
  marginBottom: 16,
});

export default function InvoicesPage() {
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const [ccID, setCCID] = useState<string>(constants.NUBANK_CC_ID);

  const $expenses = useExpensesQuery(month, ccID);

  console.log({ $expenses });

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 70,
      valueFormatter: (params) => params.value.format("DD/MM"),
    },
    { field: "name", headerName: "Name", width: 350 },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 130,
      valueFormatter: (params) => formatCurrency(params.value),
    },
  ];

  return (
    <>
      <Container>
        <DatePicker
          label="Month"
          value={month}
          onChange={(newValue) => setMonth(newValue as Dayjs)}
          format="MM/YY"
        />
        <Select
          value={ccID}
          label="Age"
          onChange={(evt) => setCCID(evt.target.value as string)}
        >
          <MenuItem value={constants.NUBANK_CC_ID}>Nubank</MenuItem>
          <MenuItem value={constants.XP_CC_ID}>XP</MenuItem>
        </Select>
        <TextField
          label="Invoice Value"
          InputProps={{ readOnly: true }}
          value={formatCurrency(
            $expenses.data?.reduce((acc, e) => acc + e.amount, 0) || 0
          )}
        />
      </Container>
      <DataGrid
        rows={$expenses.data || []}
        columns={columns}
        checkboxSelection
      />
    </>
  );
}
