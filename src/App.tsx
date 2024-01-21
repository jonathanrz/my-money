import { useState } from "react";
import { Route } from "wouter";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MainAppBar from "./components/MainAppBar";
import MainNav from "./components/MainNav";
import ResumePage from "./pages/Resume";
import InvoicesPage from "./pages/Invoices";
import constants from "./constants";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${constants.drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function App() {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MainAppBar open={open} handleDrawerOpen={() => setOpen(true)} />
      <MainNav open={open} handleDrawerClose={() => setOpen(false)} />
      <Main open={open}>
        <DrawerHeader />

        <Route path="/invoices" component={InvoicesPage} />
        <Route path="/" component={ResumePage} />
      </Main>
    </Box>
  );
}
