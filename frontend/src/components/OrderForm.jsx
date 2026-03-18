import { useEffect, useState } from "react";
import { createOrder, updateOrder } from "../services/api";

const COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "Australia",
  "Singapore",
  "Hong Kong",
];

const PRODUCT_OPTIONS = [
  "Fiber Internet 300 Mbps",
  "5GUnlimited Mobile Plan",
  "Fiber Internet 1 Gbps",
  "Business Internet 500 Mbps",
  "VoIP Corporate Package",
];

const STATUS_OPTIONS = ["Pending", "In progress", "Completed"];

const CREATED_BY_OPTIONS = [
  "Mr. Michael Harris",
  "Mr. Ryan Cooper",
  "Ms. Olivia Carter",
  "Mr. Lucas Martin",
];

function OrderForm({ initial, onClose, onSaved }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
    street_address: "",
    city: "",
    state_province: "",
    postal_code: "",
    country: COUNTRY_OPTIONS[0],
    product: PRODUCT_OPTIONS[0],
    quantity: 1,
    unit_price: 0,
    total_amount: 0,
    status: "Pending",
    created_by: CREATED_BY_OPTIONS[0],
  });
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    if (initial) {
      setForm({
        ...form,
        ...initial,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const recalcTotal = (partial) => {
    const quantity = Number(partial.quantity ?? form.quantity ?? 0);
    const unitPrice = Number(partial.unit_price ?? form.unit_price ?? 0);
    return {
      ...partial,
      total_amount: quantity * unitPrice,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = {
      ...form,
      [name]:
        e.target.type === "number" && value !== ""
          ? Number(value)
          : value,
    };
    if (name === "quantity" || name === "unit_price") {
      next = recalcTotal(next);
    }
    setForm(next);
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors({});
      if (isEdit) {
        await updateOrder(initial.id, form);
      } else {
        await createOrder(form);
      }
      onSaved?.();
    } catch (err) {
      const apiErrors = err.response?.data || {};
      const nextErrors = {};
      Object.keys(apiErrors).forEach((field) => {
        const msg = Array.isArray(apiErrors[field])
          ? apiErrors[field][0]
          : String(apiErrors[field]);
        nextErrors[field] = msg || "Please fill the field";
      });
      setErrors(nextErrors);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-50">
              {isEdit ? "Edit Order" : "Create Order"}
            </h2>
            <p className="text-xs text-slate-400">
              All fields marked with * are mandatory.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto px-5 py-4 md:grid-cols-2"
        >
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Customer Information
            </h3>

            {[
              { name: "first_name", label: "First name" },
              { name: "last_name", label: "Last name" },
              { name: "email_id", label: "Email id" },
              { name: "phone_number", label: "Phone number" },
              { name: "street_address", label: "Street Address" },
              { name: "city", label: "City" },
              { name: "state_province", label: "State / Province" },
              { name: "postal_code", label: "Postal code" },
            ].map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="flex items-center justify-between text-xs font-medium text-slate-200">
                  <span>
                    {field.label}
                    <span className="text-rose-400"> *</span>
                  </span>
                </label>
                <input
                  name={field.name}
                  value={form[field.name] ?? ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
                {errors[field.name] && (
                  <p className="text-xs text-rose-400">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <div className="space-y-1">
              <label className="flex items-center justify-between text-xs font-medium text-slate-200">
                <span>
                  Country<span className="text-rose-400"> *</span>
                </span>
              </label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-xs text-rose-400">{errors.country}</p>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Order Information
            </h3>

            <div className="space-y-1">
              <label className="flex items-center justify-between text-xs font-medium text-slate-200">
                <span>
                  Choose product<span className="text-rose-400"> *</span>
                </span>
              </label>
              <select
                name="product"
                value={form.product}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              >
                {PRODUCT_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.product && (
                <p className="text-xs text-rose-400">{errors.product}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="flex items-center justify-between text-xs font-medium text-slate-200">
                  <span>
                    Quantity<span className="text-rose-400"> *</span>
                  </span>
                </label>
                <input
                  type="number"
                  min={1}
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
                {errors.quantity && (
                  <p className="text-xs text-rose-400">
                    {errors.quantity}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="flex items-center justify-between text-xs font-medium text-slate-200">
                  <span>
                    Unit price<span className="text-rose-400"> *</span>
                  </span>
                </label>
                <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400">
                  <span className="mr-1 text-slate-400">$</span>
                  <input
                    type="number"
                    name="unit_price"
                    value={form.unit_price}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none"
                    step="0.01"
                  />
                </div>
                {errors.unit_price && (
                  <p className="text-xs text-rose-400">
                    {errors.unit_price}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="flex items-center justify-between text-xs font-medium text-slate-200">
                <span>
                  Total amount<span className="text-rose-400"> *</span>
                </span>
              </label>
              <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-emerald-300">
                <span className="mr-1 text-slate-400">$</span>
                <span>{Number(form.total_amount).toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Calculated as Quantity × Unit price (read only).
              </p>
            </div>

            <div className="space-y-1">
              <label className="flex items-center justify-between text-xs font-medium text-slate-200">
                <span>
                  Status<span className="text-rose-400"> *</span>
                </span>
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-xs text-rose-400">{errors.status}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-center justify-between text-xs font-medium text-slate-200">
                <span>
                  Created by<span className="text-rose-400"> *</span>
                </span>
              </label>
              <select
                name="created_by"
                value={form.created_by}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              >
                {CREATED_BY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.created_by && (
                <p className="text-xs text-rose-400">
                  {errors.created_by}
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm hover:bg-emerald-400"
              >
                {isEdit ? "Save changes" : "Create order"}
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;