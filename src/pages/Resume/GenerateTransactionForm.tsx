import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AccountSelect from "../../components/AccountSelect";
import TransactionTypeSelect from "../../components/TransactionTypeSelect";
import type { GenerateTransactionFormValues } from "./models";
import { Transaction } from "../../models";

interface GenerateTransactionFormProps {
  transaction: Transaction;
  onSubmit: (values: GenerateTransactionFormValues) => void;
}

const Container = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridGap: theme.spacing(3),
  padding: theme.spacing(5),
}));

export default function GenerateTransactionForm({
  transaction,
  onSubmit,
}: GenerateTransactionFormProps) {
  const formik = useFormik({
    initialValues: {
      type: "expense",
      date: transaction.date,
      name: transaction.name,
      account_id: transaction.account_id,
      amount: transaction.amount,
      bill_id: transaction.bill_id,
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
        <TransactionTypeSelect
          name="type"
          value={formik.values.type}
          onChange={formik.handleChange}
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
          type="number"
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
