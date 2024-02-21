import { useMemo, useState } from "react";
import { groupBy } from "lodash";
import { styled } from "@mui/material/styles";
import { useMutation, useQueryClient } from "react-query";
import { Button, Dialog, DialogTitle } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useAccountQuery from "../../hooks/useAccountQuery";
import useCategoriesQuery from "../../hooks/useCategoriesQuery";
import useBillsQuery from "../../hooks/useBillsQuery";
import formatCurrency from "../../helpers/formatCurrency";
import constants from "../../constants";
import type { Bill } from "../../models";
import BillForm from "./BillForm";

const AddButtonContainer = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: "flex",
  justifyContent: "flex-end",
}));

export default function BillsPage() {
  const [openNewBillDialog, setOpenNewBillDialog] = useState(false);
  const queryClient = useQueryClient();
  const accountsAsync = useAccountQuery();
  const billsAsync = useBillsQuery();
  const categoriesAsync = useCategoriesQuery();

  const newBill = useMutation({
    mutationFn: async (bill: Bill) => {
      console.log({ bill });
      await fetch(`${constants.URLS.bills}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bill),
      });

      queryClient.invalidateQueries({
        queryKey: constants.reactQueryKeyes.bills,
      });

      setOpenNewBillDialog(false);
    },
  });

  const deleteBill = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${constants.URLS.bills}/${id}`, {
        method: "DELETE",
      });

      queryClient.invalidateQueries({
        queryKey: constants.reactQueryKeyes.bills,
      });
    },
  });

  const accounts = useMemo(
    () => groupBy(accountsAsync.data, "id"),
    [accountsAsync.data]
  );

  const categories = useMemo(
    () => groupBy(categoriesAsync.data, "id"),
    [categoriesAsync.data]
  );

  const columns: GridColDef[] = [
    {
      field: "init_date",
      headerName: "Init Date",
      width: 100,
      valueFormatter: (params) => params.value.format("DD/MM/YY"),
    },
    {
      field: "end_date",
      headerName: "End Date",
      width: 100,
      valueFormatter: (params) => params.value.format("DD/MM/YY"),
    },
    { field: "name", headerName: "Name", width: 300 },
    {
      field: "account_id",
      headerName: "Account",
      width: 130,
      valueFormatter: (params) =>
        accounts[params.value] ? accounts[params.value][0].name : params.value,
    },
    {
      field: "category_id",
      headerName: "Category",
      width: 200,
      valueFormatter: (params) =>
        categories[params.value]
          ? categories[params.value][0].name
          : params.value,
    },
    {
      field: "value",
      headerName: "Value",
      type: "number",
      width: 130,
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "id",
      headerName: "Actions",
      type: "number",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => {
            if (confirm("Are you sure?"))
              deleteBill.mutate(params.value as string);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <AddButtonContainer>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenNewBillDialog(true)}
        >
          New Bill
        </Button>
      </AddButtonContainer>
      {openNewBillDialog && (
        <Dialog open onClose={() => setOpenNewBillDialog(false)}>
          <DialogTitle>New Bill</DialogTitle>
          <BillForm onSubmit={newBill.mutate} />
        </Dialog>
      )}
      <DataGrid rows={billsAsync.data || []} columns={columns} />
    </>
  );
}
