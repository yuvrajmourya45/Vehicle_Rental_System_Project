import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { DollarSign, TrendingUp, Users, Car, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function Reports() {
  const [stats, setStats] = useState({ revenue: 0, growth: 0, users: 0, vehicles: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data: dashData } = await API.get('/admin/dashboard');
      setStats({
        revenue: dashData.totalRevenue,
        growth: 0,
        users: dashData.totalUsers,
        vehicles: dashData.totalVehicles
      });

      const { data: reportData } = await API.get('/admin/reports');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formatted = reportData.monthlyRevenue.map(item => ({
        month: months[item._id - 1],
        revenue: item.revenue,
        bookings: item.count,
        users: 0
      }));
      setMonthlyData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex"><AdminSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-purple-600" /></div></div>
  );

  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-12 md:mt-0">Reports</h1>
        
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <DollarSign className="text-purple-600 mb-2" size={28} />
            <h3 className="text-gray-600 text-xs">Total Revenue</h3>
            <p className="text-2xl font-bold">${stats.revenue}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <TrendingUp className="text-green-600 mb-2" size={28} />
            <h3 className="text-gray-600 text-xs">Growth Rate</h3>
            <p className="text-2xl font-bold">+{stats.growth}%</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <Users className="text-blue-600 mb-2" size={28} />
            <h3 className="text-gray-600 text-xs">New Users</h3>
            <p className="text-2xl font-bold">{stats.users}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-4">
            <Car className="text-yellow-600 mb-2" size={28} />
            <h3 className="text-gray-600 text-xs">New Vehicles</h3>
            <p className="text-2xl font-bold">{stats.vehicles}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Monthly Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-3">Month</th>
                  <th className="text-left p-3">Revenue</th>
                  <th className="text-left p-3">Bookings</th>
                  <th className="text-left p-3">New Users</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.length === 0 ? (
                  <tr><td colSpan="4" className="p-3 text-center text-gray-500">No data available</td></tr>
                ) : (
                  monthlyData.map((data, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3 font-medium">{data.month}</td>
                      <td className="p-3 font-bold text-green-600">${data.revenue}</td>
                      <td className="p-3">{data.bookings}</td>
                      <td className="p-3">{data.users}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
