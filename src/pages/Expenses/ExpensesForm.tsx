import { useFormik } from "formik";
import dayjs from "dayjs";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AccountSelect from "../../components/AccountSelect";
import BillSelect from "../../components/BillSelect";
import CategorySelect from "../../components/CategorySelect";
import type { Expense } from "../../models";

interface InputDataFormProps {
  onSubmit: (values: Expense) => void;
  expense: Expense | null;
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

function InputDataForm({ onSubmit, expense }: InputDataFormProps) {
  const formik = useFormik({
    initialValues: {
      id: expense?.id,
      account_id: expense?.account_id || "",
      category_id: expense?.category_id || "",
      date: expense?.date || dayjs(),
      name: expense?.name || "",
      amount: expense?.amount || 0,
      confirmed: expense?.confirmed || false,
      billForecast: expense?.billForecast || false,
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
        <BillSelect
          name="bill_id"
          value={formik.values.bill_id || ""}
          onChange={formik.handleChange}
        />
        <CategorySelect
          name="category_id"
          value={formik.values.category_id || ""}
          onChange={formik.handleChange}
        />
        <Button color="primary" variant="contained" type="submit">
          Submit
        </Button>
      </Container>
    </form>
  );
}

export default InputDataForm;
