import { Divider, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import InputDataForm from "./InputDataForm";
import type { InputDataFormValues } from "./models";

const URL = "https://myexpenses-api-phx-prd.herokuapp.com/api/expenses?";

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
}));

function ImportPage() {
  function getCreditCardId(ccName: string) {
    if (ccName === "Nubank") return 7;
    if (ccName === "Bradesco") return 8;
    if (ccName === "XP") return 9;

    console.error(`${ccName} not found`);
  }

  async function insertExpenses(expenses: Array<any>, date: Dayjs) {
    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];
      const isoDate = dayjs(expense.date)
        .hour(-3)
        .minute(0)
        .second(0)
        .millisecond(0);
      const newExpense = {
        date: isoDate.toISOString(),
        name: expense.name,
        account:
          expense.account?.id || getCreditCardId(expense.credit_card?.name),
        amount: expense.value,
        installment_count: expense.installmentCount,
        installment_number: expense.installmentNumber,
        installment_uuid: expense.installmentUUID,
        confirmed: expense.confirmed,
        nubank_id: expense.nubank_id,
        bill_id: expense.bill?.id,
      };

      await fetch(
        `http://localhost:3001/expenses-${date.year()}-${date.month() + 1}`,
        {
          method: "POST",
          body: JSON.stringify(newExpense),
        }
      );
    }
  }

  function onSubmit(values: InputDataFormValues) {
    fetch(
      URL +
        new URLSearchParams({
          init_date: values.month?.startOf("month").format("YYYY-MM-DD") ?? "",
          end_date: values.month?.endOf("month").format("YYYY-MM-DD") ?? "",
        }),
      {
        headers: {
          Authorization: `Bearer ${values.token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => insertExpenses(res.data, values.month!.add(1, "day")));
  }

  return (
    <Container>
      <Typography variant="h4">Expenses</Typography>
      <InputDataForm onSubmit={onSubmit} />
      <Divider />
    </Container>
  );
}

export default ImportPage;
