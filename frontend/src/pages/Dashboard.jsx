import { useEffect, useState } from "react";
import { getOrders } from "../services/api";

function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await getOrders();
    setOrders(res.data || []);
  };

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-6">
        Overview of your business performance
      </p>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-xs text-slate-400">Total Revenue</p>
          <h2 className="text-2xl text-emerald-400">
            ${totalRevenue.toFixed(2)}
          </h2>
        </div>

        <div className="card">
          <p className="text-xs text-slate-400">Orders</p>
          <h2 className="text-2xl">{orders.length}</h2>
        </div>

        <div className="card">
          <p className="text-xs text-slate-400">Customers</p>
          <h2 className="text-2xl">
            {[...new Set(orders.map((o) => o.email_id))].length}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;