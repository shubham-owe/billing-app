"use client";

type CustomerFormProps = {
  customerName: string;
  customerPhone: string;
  onCustomerName: (value: string) => void;
  onCustomerPhone: (value: string) => void;
};

export default function CustomerForm({
  customerName,
  customerPhone,
  onCustomerName,
  onCustomerPhone
}: CustomerFormProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-base font-semibold">Customer Details (Optional)</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <input
          className="input"
          onChange={(e) => onCustomerName(e.target.value)}
          placeholder="Customer Name"
          value={customerName}
        />
        <input
          className="input"
          onChange={(e) => onCustomerPhone(e.target.value)}
          placeholder="Customer Phone"
          value={customerPhone}
        />
      </div>
    </div>
  );
}
