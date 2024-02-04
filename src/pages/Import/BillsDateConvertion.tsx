import { Button } from "@mui/material";
import dayjs from "dayjs";

function BillsDateConvertion() {
  async function convertBills() {
    const bills = await fetch(`http://localhost:3001/bills`).then((res) =>
      res.json()
    );
    for (let i = 0; i < bills.length; i++) {
      const bill = bills[i];
      await fetch(`http://localhost:3001/bills/${bill.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...bill,
          init_date: dayjs(bill.init_date).hour(-3).toISOString(),
          end_date: dayjs(bill.end_date).hour(-3).toISOString(),
        }),
      });
    }
  }
  return (
    <Button
      onClick={convertBills}
      color="primary"
      variant="contained"
      sx={{ width: "200px" }}
    >
      Submit
    </Button>
  );
}

export default BillsDateConvertion;
