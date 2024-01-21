import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function InputDataForm() {
  const formik = useFormik({
    initialValues: {
      token: "",
      month: "",
    },
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
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
