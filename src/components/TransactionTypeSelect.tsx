import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const options = [
  {
    value: "expense",
    label: "Expense",
  },
  {
    value: "receipt",
    label: "Receipt",
  },
];

export default function TransactionTypeSelect({
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
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>{label || "Type"}</InputLabel>
        <Select value={value} label="Age" name={name} onChange={onChange}>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
