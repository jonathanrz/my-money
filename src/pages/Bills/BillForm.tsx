import { useFormik } from "formik";
import dayjs from "dayjs";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AccountSelect from "../../components/AccountSelect";
import CategorySelect from "../../components/CategorySelect";
import type { Bill } from "../../models";

interface InputDataFormProps {
  onSubmit: (values: Bill) => void;
  bill: Bill | null;
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

function InputDataForm({ onSubmit, bill }: InputDataFormProps) {
  const formik = useFormik({
    initialValues: {
      id: bill?.id,
      account_id: bill?.account_id || "",
      category_id: bill?.category_id || "",
      due_day: bill?.due_day || 1,
      end_date: bill?.end_date || dayjs(),
      init_date: bill?.init_date || dayjs(),
      name: bill?.name || "",
      value: bill?.value || 0,
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
          label="Init Date"
          value={formik.values.init_date}
          onChange={(newValue) => formik.setFieldValue("init_date", newValue)}
          format="DD/MM/YY"
        />
        <DatePicker
          label="End Date"
          value={formik.values.end_date}
          onChange={(newValue) => formik.setFieldValue("end_date", newValue)}
          format="DD/MM/YY"
        />
        <TextField
          id="due_day"
          label="Due Day"
          type="number"
          value={formik.values.due_day}
          onChange={formik.handleChange}
        />
        <TextField
          id="value"
          label="Value"
          type="number"
          value={formik.values.value}
          onChange={formik.handleChange}
        />
        <AccountSelect
          name="account_id"
          value={formik.values.account_id}
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
