import React from "react";
import ReactDOM from "react-dom/client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClient, QueryClientProvider } from "react-query";
import numbro from "numbro";
import dayjs from "dayjs";
import dayjsIsSameOrBefore from "dayjs/plugin/isSameOrBefore";
import dayjsIsSameOrAfter from "dayjs/plugin/isSameOrAfter";
import App from "./App.tsx";

const queryClient = new QueryClient();

// define a language
numbro.registerLanguage({
  languageTag: "pt-BR",
  delimiters: {
    thousands: ".",
    decimal: ",",
  },
  abbreviations: {
    thousand: "k",
    million: "m",
    billion: "b",
    trillion: "t",
  },
  ordinal: (number) => {
    return number === 1 ? "er" : "ème";
  },
  currency: {
    symbol: "R$",
    position: "prefix",
    code: "BRL",
  },
  currencyFormat: {
    thousandSeparated: true,
    totalLength: 4,
    spaceSeparated: true,
    average: true,
  },
  formats: {
    fourDigits: {
      totalLength: 4,
      spaceSeparated: true,
      average: true,
    },
    fullWithTwoDecimals: {
      output: "currency",
      mantissa: 2,
      spaceSeparated: true,
      thousandSeparated: true,
    },
    fullWithTwoDecimalsNoCurrency: {
      mantissa: 2,
      thousandSeparated: true,
    },
    fullWithNoDecimals: {
      output: "currency",
      spaceSeparated: true,
      thousandSeparated: true,
      mantissa: 0,
    },
  },
});
numbro.setLanguage("pt-BR");
dayjs.extend(dayjsIsSameOrBefore);
dayjs.extend(dayjsIsSameOrAfter);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
