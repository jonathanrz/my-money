import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useMutation, useQueryClient } from "react-query";
import { Transaction } from "../../models";
import { GenerateTransactionFormValues } from "./models";
import constants from "../../constants";
import GenerateTransactionForm from "./GenerateTransactionForm";

export default function GenerateTransactionDialog({
  transaction,
  handleClose,
}: {
  transaction: Transaction;
  handleClose: () => void;
}) {
  const queryClient = useQueryClient();
  const generateTransactionMutation = useMutation({
    mutationFn: async (values: GenerateTransactionFormValues) => {
      const { type, ...params } = values;
      const url =
        type === "expense"
          ? constants.URLS.buildExpensesUrl(values.date)
          : constants.URLS.receipts;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      queryClient.invalidateQueries({
        queryKey: constants.reactQueryKeyes.bankAccounts,
      });
      if (type === "expense") {
        queryClient.invalidateQueries({
          queryKey: constants.reactQueryKeyes.generateExpenseKey(values.date),
        });
        queryClient.invalidateQueries({
          queryKey: constants.reactQueryKeyes.generateMonthExpenseKey(
            values.date
          ),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: constants.reactQueryKeyes.generateReceiptKey(values.date),
        });
      }

      handleClose();
    },
  });
  return (
    <Dialog onClose={handleClose} open>
      <DialogTitle>Transaction</DialogTitle>
      <GenerateTransactionForm
        transaction={transaction}
        onSubmit={generateTransactionMutation.mutate}
      />
    </Dialog>
  );
}
