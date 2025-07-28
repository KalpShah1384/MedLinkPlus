import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { FaBox, FaCheckCircle, FaTruck, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AdminDashboard = () => {
  const { token } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchStats();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Since we don't have a specific stats endpoint, we'll calculate from orders
      const ordersResponse = await axios.get(`${backendUrl}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const orders = ordersResponse.data.orders || [];
      const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.orderStatus === 'processing').length,
        completedOrders: orders.filter(o => o.orderStatus === 'delivered').length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${backendUrl}/api/orders/update-status`,
        { orderId, status },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      processing: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaBox className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaTruck className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaCheckCircle className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Completed Orders</p>
              <p className="text-2xl font-bold">{stats.completedOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <span className="font-bold">₹</span>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Delivery Management */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Medicine Delivery Management</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FaBox size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <FaTruck size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FaCheckCircle size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Completed Orders</p>
                <p className="text-2xl font-bold">{stats.completedOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FaDollarSign size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                All Orders
              </button>
            </nav>
          </div>
          
          {/* Orders Tab Content */}
          {activeTab === 'orders' && (
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <FaShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                  <p className="mt-1 text-sm text-gray-500">As soon as customers place orders, they'll appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id.substring(0, 8).toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                            <div className="text-sm text-gray-500">{order.userEmail}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <span className="font-medium">{item.quantity}x</span>
                                  <span>{item.name}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${order.totalAmount?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={order.status || 'processing'} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {(order.status === 'processing' || order.status === 'pending') && (
                                <button
                                  onClick={() => updateOrderStatus(order._id, 'shipped')}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Mark as Shipped
                                </button>
                              )}
                              {order.status === 'shipped' && (
                                <button
                                  onClick={() => updateOrderStatus(order._id, 'delivered')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Mark as Delivered
                                </button>
                              )}
                              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                <button
                                  onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                  className="text-red-600 hover:text-red-900 ml-2"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders
            </button>
          </nav>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No orders found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.userName}</div>
                          <div className="text-sm text-gray-500">{order.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.items.length} items</div>
                          <div className="text-sm text-gray-500">
                            {order.items.slice(0, 2).map(item => item.name).join(', ')}
                            {order.items.length > 2 && '...'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateOrderStatus(order._id, 'shipped')}
                              className="text-blue-600 hover:text-blue-900"
                              disabled={order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled'}
                            >
                              Ship
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'delivered')}
                              className="text-green-600 hover:text-green-900"
                              disabled={order.status === 'delivered' || order.status === 'cancelled'}
                            >
                              Deliver
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                              disabled={order.status === 'cancelled' || order.status === 'delivered'}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
