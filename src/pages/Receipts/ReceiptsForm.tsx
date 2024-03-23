import { useFormik } from "formik";
import dayjs from "dayjs";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AccountSelect from "../../components/AccountSelect";
import type { Receipt } from "../../models";

interface ReceiptFormProps {
  onSubmit: (values: Receipt) => void;
  receipt: Receipt | null;
}

const Container = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridGap: theme.spacing(3),
  padding: theme.spacing(5),
}));

const TwoColumnsElement = styled("div")(() => ({
  gridColumn: "span 2",
}));

function ReceiptsForm({ onSubmit, receipt }: ReceiptFormProps) {
  const formik = useFormik({
    initialValues: {
      id: receipt?.id,
      account_id: receipt?.account_id || "",
      date: receipt?.date || dayjs(),
      name: receipt?.name || "",
      amount: receipt?.amount || 0,
      confirmed: receipt?.confirmed || false,
    },
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Container>
        <TwoColumnsElement>
          <TextField
            id="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            sx={{ width: "100%" }}
          />
        </TwoColumnsElement>
        <DatePicker
          label="Date"
          value={formik.values.date}
          onChange={(newValue) => formik.setFieldValue("date", newValue)}
          format="DD/MM/YY"
        />
        <TextField
          id="amount"
          label="Amount"
          type="number"
          value={formik.values.amount}
          onChange={formik.handleChange}
        />
        <AccountSelect
          name="account_id"
          value={formik.values.account_id || ""}
          onChange={formik.handleChange}
        />
        <Button color="primary" variant="contained" type="submit">
          Submit
        </Button>
      </Container>
    </form>
  );
}

export default ReceiptsForm;
