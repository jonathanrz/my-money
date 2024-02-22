import { useMemo, useState, ReactNode } from "react";
import { groupBy } from "lodash";
import { styled } from "@mui/material/styles";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useAccountQuery from "../../hooks/useAccountQuery";
import useCategoriesQuery from "../../hooks/useCategoriesQuery";
import useBillsQuery from "../../hooks/useBillsQuery";
import type { Account, Bill, Category } from "../../models";

const AddButtonContainer = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: "flex",
  justifyContent: "flex-end",
}));

export interface GenerateColumnsProps {
  accounts: Record<string, Account>;
  bills: Record<string, Bill>;
  categories: Record<string, Category>;
  setEditData: (data: any) => void;
}

export interface GenerateFromProps {
  dataToEdit: any;
  onDataUpdated: () => void;
}

export default function CrudTable<Data>({
  rows,
  generateColumns,
  generateForm,
}: {
  rows: Array<Data>;
  generateColumns: (props: GenerateColumnsProps) => GridColDef[];
  generateForm: (props: GenerateFromProps) => ReactNode;
}) {
  const [openNewDataDialog, setOpenNewDataDialog] = useState(false);
  const [editData, setEditData] = useState<Data | null>(null);
  const accountsAsync = useAccountQuery();
  const billsAsync = useBillsQuery();
  const categoriesAsync = useCategoriesQuery();

  function onDataUpdated() {
    setOpenNewDataDialog(false);
    setEditData(null);
  }

  const accounts = useMemo(() => {
    const accountsDictionary = groupBy(accountsAsync.data, "id");
    const accountDictionary: Record<string, Account> = {};
    Object.keys(accountsDictionary).forEach((key) => {
      accountDictionary[key] = accountsDictionary[key][0];
    });
    return accountDictionary;
  }, [accountsAsync.data]);

  const bills = useMemo(() => {
    const billsDictionary = groupBy(billsAsync.data, "id");
    const billDictionary: Record<string, Bill> = {};
    Object.keys(billsDictionary).forEach((key) => {
      billDictionary[key] = billsDictionary[key][0];
    });
    return billDictionary;
  }, [billsAsync.data]);

  const categories = useMemo(() => {
    const categoriessDictionary = groupBy(categoriesAsync.data, "id");
    const categoryDictionary: Record<string, Category> = {};
    Object.keys(categoriessDictionary).forEach((key) => {
      categoryDictionary[key] = categoriessDictionary[key][0];
    });
    return categoryDictionary;
  }, [categoriesAsync.data]);

  const columns = generateColumns({ accounts, bills, categories, setEditData });

  return (
    <>
      <AddButtonContainer>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenNewDataDialog(true)}
        >
          New Data
        </Button>
      </AddButtonContainer>
      {(openNewDataDialog || editData) && (
        <Dialog
          open
          onClose={() => {
            setOpenNewDataDialog(false);
            setEditData(null);
          }}
        >
          <DialogTitle>New Data</DialogTitle>
          {generateForm({ dataToEdit: editData, onDataUpdated })}
        </Dialog>
      )}
      <DataGrid rows={rows} columns={columns} />
    </>
  );
}
