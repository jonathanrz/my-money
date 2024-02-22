import { useFormik } from "formik";
import { Button, TextField, Checkbox, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { Category } from "../../models";

interface InputDataFormProps {
  onSubmit: (values: Category) => void;
  category: Category | null;
}

const Container = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridGap: theme.spacing(3),
  padding: theme.spacing(5),
}));

const CheckboxContainer = styled("div")(({ theme }) => ({
  gap: theme.spacing(0.1),
  alignItems: "center",
  display: "flex",
}));

const TwoColumnsElement = styled("div")(() => ({
  gridColumn: "span 2",
}));

function InputDataForm({ onSubmit, category }: InputDataFormProps) {
  const formik = useFormik({
    initialValues: {
      id: category?.id,
      name: category?.name || "",
      forecast: category?.forecast || 0,
      display_in_month_expense: category?.display_in_month_expense || false,
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
        <TextField
          id="forecast"
          label="Forecast"
          type="number"
          value={formik.values.forecast}
          onChange={formik.handleChange}
        />
        <CheckboxContainer>
          <Checkbox
            name="display_in_month_expense"
            checked={formik.values.display_in_month_expense}
            onChange={formik.handleChange}
          />
          <Typography variant="body2">Show in month expenses</Typography>
        </CheckboxContainer>
        <Button color="primary" variant="contained" type="submit">
          Submit
        </Button>
      </Container>
    </form>
  );
}

export default InputDataForm;
