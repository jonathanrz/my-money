import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import orderBy from "lodash/orderBy";
import { useQuery } from "react-query";
import constants from "../constants";

export default function BillSelect({
  onChange,
  value,
  label,
  name,
}: {
  onChange: (event: SelectChangeEvent) => void;
  value: string;
  label?: string;
  name: string;
}) {
  const billsAsync = useQuery(constants.reactQueryKeyes.bills, () =>
    fetch(constants.URLS.bills)
      .then((res) => res.json())
      .then((res) => orderBy(res, ["name"], ["asc"]))
  );

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>{label || "Bill"}</InputLabel>
        <Select value={value} label="Age" name={name} onChange={onChange}>
          {billsAsync.isLoading && <CircularProgress />}
          {billsAsync.error ? (
            <Alert severity="error">{JSON.stringify(billsAsync.error)}</Alert>
          ) : null}
          {billsAsync.data?.map((bill) => (
            <MenuItem key={bill.id} value={bill.id}>
              {bill.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
