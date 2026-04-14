import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { DollarSign, TrendingUp, Users, Car, Loader2, BarChart2, Calendar } from "lucide-react";
import API from "../../services/api";

export default function Reports() {
  const [stats, setStats] = useState({ revenue: 0, users: 0, vehicles: 0, bookings: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const { data: dashData } = await API.get('/admin/dashboard');
      setStats({ revenue: dashData.totalRevenue || 0, users: dashData.totalUsers, vehicles: dashData.totalVehicles, bookings: dashData.totalBookings || 0 });
      const { data: reportData } = await API.get('/admin/reports');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setMonthlyData(reportData.monthlyRevenue.map(item => ({ month: months[item._id - 1], revenue: item.revenue, bookings: item.count })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1);

  if (loading) return (
    <div className="flex"><AdminSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-purple-600" /></div></div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="md:ml-56 flex-1 p-4 md:p-8">

        <div className="mb-8 mt-16 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Reports & Analytics</h1>
          <p className="text-gray-500">Overview of platform performance</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, bg: 'from-green-500 to-emerald-600' },
            { label: 'Total Users', value: stats.users, icon: Users, bg: 'from-blue-500 to-blue-600' },
            { label: 'Total Vehicles', value: stats.vehicles, icon: Car, bg: 'from-purple-500 to-purple-600' },
            { label: 'Total Bookings', value: stats.bookings, icon: BarChart2, bg: 'from-orange-500 to-orange-600' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className={`bg-gradient-to-br ${card.bg} p-3 rounded-xl shadow-md w-fit mb-4`}><Icon className="text-white" size={22} /></div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-2.5 rounded-xl"><TrendingUp className="text-purple-600" size={22} /></div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Monthly Revenue</h2>
              <p className="text-sm text-gray-500">Revenue trend over the year</p>
            </div>
          </div>
          {monthlyData.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <BarChart2 size={48} className="mx-auto mb-3 opacity-30" />
              <p>No data available yet</p>
            </div>
          ) : (
            <div className="flex items-end gap-2 h-48">
              {monthlyData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-xs text-gray-500 font-medium">₹{data.revenue > 999 ? `${(data.revenue/1000).toFixed(1)}k` : data.revenue}</p>
                  <div className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all hover:from-purple-700 hover:to-purple-500"
                    style={{ height: `${(data.revenue / maxRevenue) * 160 + 4}px` }}></div>
                  <p className="text-xs text-gray-400">{data.month}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
            <div className="bg-blue-100 p-2.5 rounded-xl"><Calendar className="text-blue-600" size={22} /></div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Monthly Breakdown</h2>
              <p className="text-sm text-gray-500">Detailed monthly performance</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Month</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Revenue</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Bookings</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Avg per Booking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {monthlyData.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-400">No data available</td></tr>
                ) : monthlyData.map((data, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-gray-800">{data.month}</td>
                    <td className="p-4 font-bold text-green-600">₹{data.revenue.toLocaleString()}</td>
                    <td className="p-4 text-gray-600">{data.bookings}</td>
                    <td className="p-4 text-gray-600">₹{data.bookings > 0 ? Math.round(data.revenue / data.bookings).toLocaleString() : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
