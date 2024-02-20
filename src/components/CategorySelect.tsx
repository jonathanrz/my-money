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

export default function CategorySelect({
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
  const categoriesAsync = useQuery(constants.reactQueryKeyes.categories, () =>
    fetch(constants.URLS.categories)
      .then((res) => res.json())
      .then((res) => orderBy(res, ["name"], ["asc"]))
  );

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>{label || "Category"}</InputLabel>
        <Select value={value} label="Age" name={name} onChange={onChange}>
          {categoriesAsync.isLoading && <CircularProgress />}
          {categoriesAsync.error ? (
            <Alert severity="error">
              {JSON.stringify(categoriesAsync.error)}
            </Alert>
          ) : null}
          {categoriesAsync.data?.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
