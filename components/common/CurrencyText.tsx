import { formatCurrency } from "@/lib/money";

type CurrencyTextProps = {
  paise: number;
  currency?: string;
  className?: string;
};

export default function CurrencyText({
  paise,
  currency,
  className
}: CurrencyTextProps) {
  return <span className={className}>{formatCurrency(paise, currency)}</span>;
}
