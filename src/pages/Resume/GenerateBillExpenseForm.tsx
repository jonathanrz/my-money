import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AccountSelect from "../../components/AccountSelect";
import type { GenerateBillExpenseFormValues } from "./models";
import { Transaction } from "../../models";

interface GenerateBillExpenseFormProps {
  transaction: Transaction;
  onSubmit: (values: GenerateBillExpenseFormValues) => void;
}

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  padding: theme.spacing(5),
}));

function GenerateBillExpenseForm({
  transaction,
  onSubmit,
}: GenerateBillExpenseFormProps) {
  const formik = useFormik({
    initialValues: {
      date: transaction.date,
      name: transaction.name,
      account_id: transaction.account_id,
      amount: transaction.amount,
      bill_id: transaction.bill_id || "not found",
    },
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Container>
        <DatePicker
          label="Date"
          value={formik.values.date}
          onChange={(newValue) => formik.setFieldValue("date", newValue)}
          format="DD/MM/YY"
        />
        <TextField
          id="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        <TextField
          id="amount"
          label="Amount"
          value={formik.values.amount}
          onChange={formik.handleChange}
        />
        <AccountSelect
          name="account_id"
          value={formik.values.account_id}
          onChange={formik.handleChange}
        />
        <TextField
          id="bill_id"
          label="Bill ID"
          value={formik.values.bill_id}
          onChange={formik.handleChange}
        />
        <Button color="primary" variant="contained" type="submit">
          Submit
        </Button>
      </Container>
    </form>
  );
}

export default GenerateBillExpenseForm;
