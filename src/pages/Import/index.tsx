import { styled } from "@mui/material/styles";
import { Typography, Divider } from "@mui/material";
import ExpensesImport from "./ExpensesImport";
import BillsDateConvertion from "./BillsDateConvertion";

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
}));

function ImportPage() {
  return (
    <Container>
      <Typography variant="h4">Expenses</Typography>
      <ExpensesImport />
      <Divider />
      <Typography variant="h4">Bills Date Convertion</Typography>
      <BillsDateConvertion />
      <Divider />
    </Container>
  );
}

export default ImportPage;
