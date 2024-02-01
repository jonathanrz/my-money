import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { InputDataFormValues } from "./models";

interface InputDataFormProps {
  onSubmit: (values: InputDataFormValues) => void;
}

function InputDataForm({ onSubmit }: InputDataFormProps) {
  const formik = useFormik({
    initialValues: {
      token: "",
      month: null,
    },
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        id="token"
        label="Token"
        value={formik.values.token}
        onChange={formik.handleChange}
      />
      <DatePicker
        label="Month"
        value={formik.values.month}
        onChange={(newValue) => formik.setFieldValue("month", newValue)}
        format="MM/YY"
      />
      <Button color="primary" variant="contained" type="submit">
        Submit
      </Button>
    </form>
  );
}

export default InputDataForm;
