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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customer Orders</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Create Order
        </button>
      </div>

      <OrderTable
        orders={orders}
        onEdit={(o) => {
          setEditing(o);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

      {showForm && (
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
      )}
    </div>
  );
}

export default Orders;