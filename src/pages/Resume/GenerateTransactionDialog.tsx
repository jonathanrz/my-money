import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useMutation, useQueryClient } from "react-query";
import { Transaction } from "../../models";
import { GenerateBillExpenseFormValues } from "./models";
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
  const confirmTransactionMutation = useMutation({
    mutationFn: async (values: GenerateBillExpenseFormValues) => {
      await fetch(constants.URLS.buildExpensesUrl(values.date), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      queryClient.invalidateQueries({
        queryKey: constants.reactQueryKeyes.bankAccounts,
      });
      queryClient.invalidateQueries({
        queryKey: constants.reactQueryKeyes.generateExpenseKey(values.date),
      });

      handleClose();
    },
  });
  return (
    <Dialog onClose={handleClose} open>
      <DialogTitle>Transaction</DialogTitle>
      <GenerateTransactionForm
        transaction={transaction}
        onSubmit={confirmTransactionMutation.mutate}
      />
    </Dialog>
  );
}
