import { useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getDashboardConfig, saveDashboardConfig } from "../services/api";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const WIDGET_TYPES = [
  { type: "kpi", label: "KPI Value" },
  { type: "bar", label: "Bar Chart" },
  { type: "line", label: "Line Chart" },
  { type: "pie", label: "Pie Chart" },
  { type: "area", label: "Area Chart" },
  { type: "scatter", label: "Scatter Plot" },
  { type: "table", label: "Table" },
];

const DEFAULT_SIZES = {
  kpi: { w: 2, h: 2 },
  bar: { w: 5, h: 5 },
  line: { w: 5, h: 5 },
  area: { w: 5, h: 5 },
  scatter: { w: 5, h: 5 },
  pie: { w: 4, h: 4 },
  table: { w: 4, h: 4 },
};

const NUMERIC_FIELDS = ["quantity", "unit_price", "total_amount"];

function ConfigureDashboard() {

  const [layout, setLayout] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDashboardConfig().then((res) => {
      const data = res.data;
      setLayout(data.layout_json?.lg || []);
      setWidgets(data.widgets_json || []);
    });
  }, []);

  const selectedWidget = useMemo(
    () => widgets.find((w) => w.id === selectedWidgetId) || null,
    [widgets, selectedWidgetId]
  );

  const addWidget = (type) => {
    const id = `${type}-${Date.now()}`;
    const size = DEFAULT_SIZES[type] || { w: 4, h: 4 };

    const newLayoutItem = {
      i: id,
      x: 0,
      y: Infinity,
      w: size.w,
      h: size.h,
    };

    const newWidget = {
      id,
      type,
      title: "Untitled",
      description: "",
      width: size.w,
      height: size.h,
      metric: "total_amount",
      aggregation: "sum",
      format: "number",
      decimal_precision: 0,
      x_field: "product",
      y_field: "total_amount",
      color: "#38bdf8",
      show_data_label: false,
      pie_field: "product",
      show_legend: true,
      columns: ["customer", "product", "quantity", "total_amount", "status"],
    };

    setLayout((prev) => [...prev, newLayoutItem]);
    setWidgets((prev) => [...prev, newWidget]);
    setSelectedWidgetId(id);
  };

  const removeWidget = (id) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setLayout((prev) => prev.filter((l) => l.i !== id));
    if (selectedWidgetId === id) setSelectedWidgetId(null);
  };

  const onLayoutChange = (newLayout) => {
    setLayout(newLayout);
    setWidgets((prev) =>
      prev.map((w) => {
        const l = newLayout.find((i) => i.i === w.id);
        return l ? { ...w, width: l.w, height: l.h } : w;
      })
    );
  };

  const updateSelectedWidget = (patch) => {
    if (!selectedWidget) return;
    setWidgets((prev) =>
      prev.map((w) => (w.id === selectedWidget.id ? { ...w, ...patch } : w))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveDashboardConfig({
        layout_json: { lg: layout },
        widgets_json: widgets,
      });
      alert("Dashboard configuration saved.");
    } finally {
      setSaving(false);
    }
  };

  const renderPreview = (widget) => {
    if (widget.type === "kpi") {
      return (
        <div className="flex h-full flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
          <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {widget.title || "Untitled KPI"}
          </div>
          <div className="mt-1 text-2xl font-semibold text-emerald-400">
            123
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Preview only. Live values appear on Dashboard.
          </p>
        </div>
      );
    }

    if (widget.type === "bar" || widget.type === "line") {
      const data = [
        { product: "Fiber 300", total_amount: 1200, quantity: 10 },
        { product: "5G Unlimited", total_amount: 900, quantity: 7 },
      ];
      const yKey = widget.y_field || "total_amount";
      const color = widget.color || "#38bdf8";
      const commonProps = { width: 320, height: 180, data };

      return (
        <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/60 px-2 py-2">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {widget.title || "Sample Chart"}
          </div>
          {widget.type === "bar" ? (
            <BarChart {...commonProps}>
              <XAxis dataKey="product" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey={yKey} fill={color} radius={4} />
            </BarChart>
          ) : (
            <LineChart {...commonProps}>
              <XAxis dataKey="product" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </div>
      );
    }

    if (widget.type === "table") {
      return (
        <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/60 text-[11px]">
          <div className="flex items-center justify-between border-b border-slate-800 px-2 py-1.5">
            <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {widget.title || "Orders Table"}
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/60 text-slate-400">
                <tr>
                  <th className="px-2 py-1 text-left">Customer</th>
                  <th className="px-2 py-1 text-left">Product</th>
                  <th className="px-2 py-1 text-left">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-100">
                <tr>
                  <td className="px-2 py-1">John Doe</td>
                  <td className="px-2 py-1">Fiber 300</td>
                  <td className="px-2 py-1">$120.00</td>
                </tr>
                <tr>
                  <td className="px-2 py-1">Jane Smith</td>
                  <td className="px-2 py-1">5GUnlimited</td>
                  <td className="px-2 py-1">$99.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/40 text-[11px] text-slate-500">
        {widget.title || "Untitled widget"}
      </div>
    );
  };

  const toggleColumn = (col) => {
    const cols = new Set(selectedWidget?.columns || []);
    if (cols.has(col)) cols.delete(col);
    else cols.add(col);
    updateSelectedWidget({ columns: Array.from(cols) });
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-left text-xl font-semibold text-slate-50">
              Configure Dashboard
            </h1>
            <p className="text-left text-sm text-slate-400">
              Drag and resize widgets inside the 12/8/4-column responsive grid.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3 text-xs">
          <div className="mr-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Add widget
          </div>
          {WIDGET_TYPES.map((w) => (
            <button
              key={w.type}
              type="button"
              onClick={() => addWidget(w.type)}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-100 hover:border-emerald-400 hover:text-emerald-300"
            >
              {w.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-950/40 px-1 py-1">
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768 }}
            cols={{ lg: 12, md: 8, sm: 4 }}
            rowHeight={80}
            onLayoutChange={onLayoutChange}
          >
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="group relative p-1"
                onMouseDown={() => setSelectedWidgetId(widget.id)}
              >
                <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-100 ring-1 ring-slate-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWidgetId(widget.id);
                    }}
                  >
                    Settings
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-rose-600/80 px-2 py-0.5 text-[10px] text-rose-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this widget?")) {
                        removeWidget(widget.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
                {renderPreview(widget)}
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4 text-xs">
        {selectedWidget ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Widget Settings
                </p>
                <p className="text-xs text-slate-300">
                  {selectedWidget.type.toUpperCase()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWidgetId(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-200">
                Widget title<span className="text-rose-400"> *</span>
              </label>
              <input
                value={selectedWidget.title || ""}
                onChange={(e) =>
                  updateSelectedWidget({ title: e.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-200">
                Description
              </label>
              <textarea
                rows={2}
                value={selectedWidget.description || ""}
                onChange={(e) =>
                  updateSelectedWidget({ description: e.target.value })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-200">
                  Width (columns)
                </label>
                <input
                  type="number"
                  min={1}
                  value={selectedWidget.width || 1}
                  onChange={(e) => {
                    const w = Math.max(1, Number(e.target.value || 1));
                    updateSelectedWidget({ width: w });
                    setLayout((prev) =>
                      prev.map((l) =>
                        l.i === selectedWidget.id ? { ...l, w } : l
                      )
                    );
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-200">
                  Height (rows)
                </label>
                <input
                  type="number"
                  min={1}
                  value={selectedWidget.height || 1}
                  onChange={(e) => {
                    const h = Math.max(1, Number(e.target.value || 1));
                    updateSelectedWidget({ height: h });
                    setLayout((prev) =>
                      prev.map((l) =>
                        l.i === selectedWidget.id ? { ...l, h } : l
                      )
                    );
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            {selectedWidget.type === "kpi" && (
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Data settings
                </p>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-200">
                    Select metric
                  </label>
                  <select
                    value={selectedWidget.metric || "total_amount"}
                    onChange={(e) =>
                      updateSelectedWidget({ metric: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  >
                    <option value="total_amount">Total amount</option>
                    <option value="quantity">Quantity</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-200">
                    Aggregation
                  </label>
                  <select
                    value={selectedWidget.aggregation || "sum"}
                    onChange={(e) =>
                      updateSelectedWidget({ aggregation: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  >
                    <option value="sum">Sum</option>
                    <option value="average">Average</option>
                    <option value="count">Count</option>
                  </select>
                </div>

                <div className="grid grid-cols-[2fr_1fr] gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-200">
                      Data format
                    </label>
                    <select
                      value={selectedWidget.format || "number"}
                      onChange={(e) =>
                        updateSelectedWidget({ format: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    >
                      <option value="number">Number</option>
                      <option value="currency">Currency</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-200">
                      Decimal precision
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={selectedWidget.decimal_precision ?? 0}
                      onChange={(e) =>
                        updateSelectedWidget({
                          decimal_precision: Math.max(
                            0,
                            Number(e.target.value || 0)
                          ),
                        })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {["bar", "line", "area", "scatter"].includes(
              selectedWidget.type
            ) && (
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Chart data
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-200">
                      X-Axis data
                    </label>
                    <select
                      value={selectedWidget.x_field || "product"}
                      onChange={(e) =>
                        updateSelectedWidget({ x_field: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    >
                      <option value="product">Product</option>
                      <option value="status">Status</option>
                      <option value="created_by">Created by</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-slate-200">
                      Y-Axis data
                    </label>
                    <select
                      value={selectedWidget.y_field || "total_amount"}
                      onChange={(e) =>
                        updateSelectedWidget({ y_field: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    >
                      {NUMERIC_FIELDS.map((f) => (
                        <option key={f} value={f}>
                          {f === "total_amount"
                            ? "Total amount"
                            : f === "unit_price"
                            ? "Unit price"
                            : "Quantity"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-200">
                    Chart color
                  </label>
                  <input
                    type="color"
                    value={selectedWidget.color || "#38bdf8"}
                    onChange={(e) =>
                      updateSelectedWidget({ color: e.target.value })
                    }
                    className="h-8 w-16 cursor-pointer rounded border border-slate-700 bg-slate-950"
                  />
                </div>
              </div>
            )}

            {selectedWidget.type === "table" && (
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Table columns
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["customer", "Customer name"],
                    ["product", "Product"],
                    ["quantity", "Quantity"],
                    ["total_amount", "Total amount"],
                    ["status", "Status"],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 text-[11px] text-slate-200"
                    >
                      <input
                        type="checkbox"
                        checked={selectedWidget.columns?.includes(key)}
                        onChange={() => toggleColumn(key)}
                        className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col justify-center text-center text-xs text-slate-400">
            <p className="mb-1 font-medium text-slate-200">
              Select a widget to configure
            </p>
            <p>
              Hover a widget in the canvas and click{" "}
              <span className="font-semibold text-slate-100">Settings</span> to
              edit size, data settings and styling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfigureDashboard;