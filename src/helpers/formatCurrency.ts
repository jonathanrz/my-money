import numbro from "numbro";

export default function formatCurrency(value: number) {
  return numbro(value / 100).formatCurrency({
    thousandSeparated: true,
    mantissa: 2,
  });
}
