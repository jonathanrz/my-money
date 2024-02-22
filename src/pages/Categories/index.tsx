import { useMutation, useQueryClient } from "react-query";
import { Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GridColDef } from "@mui/x-data-grid";
import useCategoriesQuery from "../../hooks/useCategoriesQuery";
import formatCurrency from "../../helpers/formatCurrency";
import constants from "../../constants";
import type { Category } from "../../models";
import CategoryForm from "./CategoryForm";
import CrudTable, {
  GenerateColumnsProps,
  GenerateFromProps,
} from "../../components/CrudTable";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const categoriesAsync = useCategoriesQuery();

  async function updateCategory(cat: Category) {
    let url = constants.URLS.categories;
    if (cat.id) url += `/${cat.id}`;
    await fetch(url, {
      method: cat.id ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cat),
    });

    queryClient.invalidateQueries({
      queryKey: constants.reactQueryKeyes.categories,
    });
  }

  const deleteCategory = useMutation({
    mutationFn: (id: string) =>
      fetch(`${constants.URLS.categories}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: constants.reactQueryKeyes.categories,
      }),
  });

  function generateColumns({ setEditData }: GenerateColumnsProps) {
    return [
      { field: "name", headerName: "Name", width: 300 },
      {
        field: "forecast",
        headerName: "Forecast",
        type: "number",
        width: 130,
        valueFormatter: (params) => formatCurrency(params.value),
      },
      {
        field: "display_in_month_expense",
        headerName: "Display in Month Expense",
        align: "center",
        width: 180,
        valueFormatter: (params) => (params.value ? "Yes" : "No"),
      },
      {
        field: "id",
        headerName: "Actions",
        type: "number",
        width: 250,
        renderCell: (params) => (
          <>
            <Box marginRight={2}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditData(params.row as Category)}
              >
                Edit
              </Button>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => {
                if (confirm("Are you sure?"))
                  deleteCategory.mutate(params.value as string);
              }}
            >
              Delete
            </Button>
          </>
        ),
      },
    ] as GridColDef[];
  }

  function generateForm({ dataToEdit, onDataUpdated }: GenerateFromProps) {
    return (
      <CategoryForm
        category={dataToEdit}
        onSubmit={(formData) =>
          updateCategory(formData).then(() => onDataUpdated())
        }
      />
    );
  }

  return (
    <CrudTable
      generateColumns={generateColumns}
      generateForm={generateForm}
      rows={categoriesAsync.data || []}
    />
  );
}
