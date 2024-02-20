import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const accounts = [
  {
    id: "1",
    name: "Bradesco",
  },
  {
    id: "2",
    name: "Nuconta PF",
  },
  {
    id: "3",
    name: "Credifoz PJ",
  },
  {
    id: "4",
    name: "Credifoz PF",
  },
  {
    id: "5",
    name: "Nuconta PJ",
  },
  {
    id: "6",
    name: "Inter",
  },
  {
    id: "7",
    name: "nubank CC",
  },
  {
    id: "8",
    name: "bradesco CC",
  },
  {
    id: "9",
    name: "xp CC",
  },
];

export default function AccountSelect({
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
        <InputLabel>{label || "Account"}</InputLabel>
        <Select value={value} label="Age" name={name} onChange={onChange}>
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
