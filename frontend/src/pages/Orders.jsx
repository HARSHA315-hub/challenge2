import { useEffect, useState } from "react";
import OrderForm from "../components/OrderForm";
import OrderTable from "../components/OrderTable";
import { getOrders, deleteOrder } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await getOrders();
    setOrders(res.data);
  };

  const handleDelete = async (id) => {
    await deleteOrder(id);
    fetchOrders();
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Customer Orders
          </h1>
          <p className="text-sm text-slate-400">
            Manage and track all customer purchases
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2 shadow-lg"
        >
          ➕ Create Order
        </button>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400 text-sm mb-2">
            No orders yet
          </p>
          <p className="text-slate-500 text-xs mb-4">
            Start by creating your first order 🚀
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Create First Order
          </button>
        </div>
      ) : (
        /* TABLE CARD */
        <div className="card">
          <OrderTable
            orders={orders}
            onEdit={(o) => {
              setEditing(o);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">

          {/* CENTERED MODAL */}
          <div className="w-full max-w-4xl px-4">

            <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-6 max-h-[90vh] overflow-y-auto">

              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>

              {/* FORM */}
              <OrderForm
                initial={editing}
                onClose={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                onSaved={() => {
                  setShowForm(false);
                  fetchOrders();
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Orders;