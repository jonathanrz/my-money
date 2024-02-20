import { useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { groupBy } from "lodash";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useAccountQuery from "../../hooks/useAccountQuery";
import useReceiptsQuery from "../../hooks/useReceiptsQuery";
import formatCurrency from "../../helpers/formatCurrency";

export default function ReceiptsPage() {
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const accountsAsync = useAccountQuery();
  const receiptsAsync = useReceiptsQuery(month);

  const accounts = useMemo(
    () => groupBy(accountsAsync.data, "id"),
    [accountsAsync.data]
  );

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Day",
      width: 70,
      valueFormatter: (params) => params.value.format("DD"),
    },
    { field: "name", headerName: "Name", width: 300 },
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
  ];

  return (
    <>
      <DatePicker
        label="Month"
        value={month}
        onChange={(newValue) => setMonth(newValue as Dayjs)}
        format="MM/YY"
      />
      <DataGrid rows={receiptsAsync.data || []} columns={columns} />
    </>
  );
}
