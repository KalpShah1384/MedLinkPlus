import React, { useEffect, useState } from "react";
import axios from "axios";
import medicineImg from '../assets/medicine.png';

const statusColors = {
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  let color = "bg-gray-100 text-gray-800";
  if (status === "completed") color = "bg-green-100 text-green-800";
  else if (status === "pending") color = "bg-yellow-100 text-yellow-800";
  else if (status === "failed" || status === "cancelled") color = "bg-red-100 text-red-800";
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "-"}
    </span>
  );
}

const MedicineDeliveryList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState(null);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
    setStatusError(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setStatusError(null);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusUpdating(true);
    setStatusError(null);
    try {
      await axios.put(
        "/api/orders/update-status",
        { orderId: selectedOrder._id, status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      setOrders((prev) => prev.map((o) => o._id === selectedOrder._id ? { ...o, status: newStatus } : o));
    } catch (err) {
      setStatusError("Failed to update status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/orders"); // Update endpoint if needed
        // Ensure the result is always an array
        let result = res.data.orders || res.data;
        if (!Array.isArray(result)) result = [];
        setOrders(result);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Ensure orders is always an array
  const safeOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = filter === "all"
    ? safeOrders
    : safeOrders.filter((order) => order.status === filter);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-lg p-8 mt-10 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <img src={medicineImg} alt="Logo" className="w-10 h-10 rounded-full border border-[#1c7856] bg-[#f6fffa]" />
        <h2 className="text-2xl font-extrabold text-[#1c7856] tracking-tight">Medicine Deliveries</h2>
      </div>
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            className={`px-4 py-1.5 rounded-full border text-sm font-semibold shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#1c7856] ${filter === s ? 'bg-[#1c7856] text-white border-[#1c7856]' : 'bg-[#f6fffa] text-[#1c7856] border-[#e2e8f0] hover:bg-[#e9f8f3]'}`}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex flex-col items-center py-16">
          <svg className="animate-spin h-8 w-8 text-[#1c7856] mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          <span className="text-[#1c7856] font-semibold">Loading deliveries...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-16 font-semibold">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <svg width="80" height="80" fill="none" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#f6fffa"/><path d="M20 50c0-6.627 7.163-12 16-12s16 5.373 16 12" stroke="#1c7856" strokeWidth="2"/><circle cx="40" cy="36" r="8" stroke="#1c7856" strokeWidth="2"/></svg>
          <span className="mt-4 text-lg font-medium">No deliveries found.</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-[#f6fffa]">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-[#e9f8f3]">
              <tr>
                <th className="px-5 py-3 text-left font-bold text-[#1c7856] uppercase whitespace-nowrap">Order ID</th>
                <th className="px-5 py-3 text-left font-bold text-[#1c7856] uppercase whitespace-nowrap">Customer</th>
                <th className="px-5 py-3 text-left font-bold text-[#1c7856] uppercase whitespace-nowrap">Items</th>
                <th className="px-5 py-3 text-left font-bold text-[#1c7856] uppercase whitespace-nowrap">Total</th>
                <th className="px-5 py-3 text-left font-bold text-[#1c7856] uppercase whitespace-nowrap">Delivery Status</th>
                <th className="px-5 py-3 text-left font-bold text-[#1c7856] uppercase whitespace-nowrap">Payment Status</th>
                <th className="px-5 py-3 text-left font-bold text-[#1c7856] uppercase whitespace-nowrap">Payment Method</th>
                <th className="px-5 py-3 text-left font-bold text-[#1c7856] uppercase whitespace-nowrap">Transaction ID</th>
                <th className="px-5 py-3 text-left font-bold text-[#1c7856] uppercase whitespace-nowrap">Address</th>
                <th className="px-5 py-3 text-left font-bold text-[#1c7856] uppercase whitespace-nowrap">Date</th>
                <th className="px-5 py-3 text-left font-bold text-[#1c7856] uppercase whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, i) => (
                <tr key={order._id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f6fffa]'}>
                  <td className="px-5 py-3 font-semibold text-[#1c7856]">#{order._id?.substring(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-900">{order.userName}</div>
                    <div className="text-xs text-gray-500">{order.userEmail}</div>
                  </td>
                  <td className="px-5 py-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx}>{item.quantity}x {item.name}</div>
                    ))}
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#1c7856]">${order.totalAmount?.toFixed(2) || '0.00'}</td>
                  <td className="px-5 py-3"><StatusBadge status={order.status || 'processing'} /></td>
                  <td className="px-5 py-3"><PaymentStatusBadge status={order.paymentStatus || 'pending'} /></td>
                  <td className="px-5 py-3">{order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : '-'}</td>
                  <td className="px-5 py-3">{order.paymentId || '-'}</td>
                  <td className="px-5 py-3">
                    {order.shippingAddress ? (
                      <div>
                        {order.shippingAddress.address}<br/>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br/>
                        {order.shippingAddress.country}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-5 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <button
                      className="px-3 py-1 rounded bg-[#1c7856] text-white text-xs font-semibold hover:bg-[#176849] transition"
                      onClick={() => handleViewOrder(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MedicineDeliveryList;
