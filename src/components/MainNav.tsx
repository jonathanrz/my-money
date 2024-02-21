import { Link } from "wouter";
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentsIcon from "@mui/icons-material/Payments";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PaidIcon from "@mui/icons-material/Paid";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import constants from "../constants";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function MainNav({
  open,
  handleDrawerClose,
}: {
  open: boolean;
  handleDrawerClose: () => void;
}) {
  return (
    <Drawer
      sx={{
        width: constants.drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: constants.drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {[
          {
            text: "Resume",
            href: "/",
            Icon: ViewWeekIcon,
          },
          {
            text: "Expenses",
            href: "/expenses",
            Icon: PaidIcon,
          },
          {
            text: "Receipts",
            href: "/receipts",
            Icon: ReceiptIcon,
          },
          {
            text: "Bills",
            href: "/bills",
            Icon: PaymentsIcon,
          },
          {
            text: "Import",
            href: "/import",
            Icon: ImportExportIcon,
          },
        ].map((route) => (
          <ListItem key={route.text} disablePadding>
            <Link href={route.href}>
              <ListItemButton>
                <ListItemIcon>
                  <route.Icon />
                </ListItemIcon>
                <ListItemText primary={route.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
