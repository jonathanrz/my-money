import { Dayjs } from "dayjs";
import InputDataForm from "./InputDataForm";
import type { InputDataFormValues } from "./models";

const URL = "https://myexpenses-api-phx-prd.herokuapp.com/api/expenses?";

function ImportPage() {
  function getCreditCardId(ccName: string) {
    if (ccName === "Nubank") return 7;
    if (ccName === "Bradesco") return 8;
    if (ccName === "XP") return 9;

    console.error(`${ccName} not found`);
  }

  async function insertExpenses(expenses: Array<any>, date: Dayjs) {
    console.log({ expenses, date, month: date.month() + 1 });
    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];
      const newExpense = {
        date: expense.date,
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

  return <InputDataForm onSubmit={onSubmit} />;
}

export default ImportPage;
