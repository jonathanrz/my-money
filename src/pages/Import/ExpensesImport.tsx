import dayjs, { Dayjs } from "dayjs";
import InputDataForm from "./InputDataForm";
import type { InputDataFormValues } from "./models";

const URL = "https://myexpenses-api-phx-prd.herokuapp.com/api/expenses?";

function ExpensesImport() {
  function getCreditCardId(ccName: string) {
    if (ccName === "Nubank") return "7";
    if (ccName === "Bradesco") return "8";
    if (ccName === "XP") return "9";

    console.error(`${ccName} not found`);
  }

  async function insertExpenses(expenses: Array<any>, date: Dayjs) {
    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];
      const isoDate = dayjs(expense.date).hour(-3);
      const newExpense = {
        date: isoDate.toISOString(),
        name: expense.name,
        account_id:
          expense.account?.id.toString() ||
          getCreditCardId(expense.credit_card?.name) ||
          null,
        bill_id: expense.bill?.id.toString() || null,
        category_id: expense.category?.id.toString() || null,
        amount: expense.value,
        installment_count: expense.installmentCount,
        installment_number: expense.installmentNumber,
        installment_uuid: expense.installmentUUID,
        confirmed: expense.confirmed,
        nubank_id: expense.nubank_id || null,
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

export default ExpensesImport;
