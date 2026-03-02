import React, { useState, useEffect } from "react";
import OwnerSidebar from "../../components/OwnerSidebar";
import { DollarSign, TrendingUp, Calendar, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function Earnings() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, growth: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const { data } = await API.get('/bookings/owner-bookings');
      const completedBookings = data.filter(b => b.status === 'completed' || b.status === 'approved');
      
      const total = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const thisMonth = completedBookings
        .filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth())
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      
      setStats({ total, thisMonth, growth: total > 0 ? ((thisMonth / total) * 100).toFixed(0) : 0 });
      setTransactions(completedBookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return (
    <div className="flex"><OwnerSidebar /><div className="md:ml-56 flex-1 flex items-center justify-center h-screen"><Loader2 size={48} className="animate-spin text-blue-600" /></div></div>
  );

  return (
    <div className="flex">
      <OwnerSidebar />
      
      <div className="md:ml-56 flex-1 bg-gray-100 min-h-screen p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 mt-12 md:mt-0">Earnings</h1>
        
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <DollarSign className="text-blue-600 mb-3" size={32} />
            <h3 className="text-gray-600 text-sm">Total Earnings</h3>
            <p className="text-3xl font-bold">${stats.total}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <Calendar className="text-green-600 mb-3" size={32} />
            <h3 className="text-gray-600 text-sm">This Month</h3>
            <p className="text-3xl font-bold">${stats.thisMonth}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <TrendingUp className="text-purple-600 mb-3" size={32} />
            <h3 className="text-gray-600 text-sm">Growth</h3>
            <p className="text-3xl font-bold">+{stats.growth}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <div className="p-4 md:p-6 border-b">
            <h2 className="text-lg md:text-xl font-bold">Transaction History</h2>
          </div>
          <table className="w-full text-sm md:text-base">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Vehicle</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b">
                  <td className="p-4 font-medium">{transaction.vehicle?.name}</td>
                  <td className="p-4">{transaction.user?.name}</td>
                  <td className="p-4">{formatDate(transaction.startDate)}</td>
                  <td className="p-4 font-bold text-green-600">${transaction.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
