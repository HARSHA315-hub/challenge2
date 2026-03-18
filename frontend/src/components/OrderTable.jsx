function OrderTable({ orders, onEdit, onDelete }) {
  if (!orders.length) {
    return (
      <div className="card text-center text-slate-400">
        No orders yet. Create one 🚀
      </div>
    );
  }

  return (
    <table className="table mt-4">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td>{o.first_name} {o.last_name}</td>
            <td>{o.product}</td>
            <td>{o.quantity}</td>
            <td>${o.unit_price}</td>
            <td className="text-emerald-400">${o.total_amount}</td>
            <td>{o.status}</td>

            <td className="flex gap-2">
              <button
                onClick={() => onEdit(o)}
                className="btn btn-secondary"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(o.id)}
                className="btn btn-primary"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrderTable;