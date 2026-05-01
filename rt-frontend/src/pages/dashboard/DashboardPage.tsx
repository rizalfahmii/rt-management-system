import { useEffect, useState } from "react";
import { getDashboardChart } from "../../services/dashboard.service";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getDashboardChart(year);
      setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [year]);

  if (!data && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return null;

  const { summary } = data;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Keuangan</h1>
            <p className="text-gray-500 mt-1">Ringkasan arus kas masuk dan keluar pengelolaan RT.</p>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border-none bg-transparent text-sm font-bold focus:ring-0 px-4 py-2 cursor-pointer outline-none"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pemasukan</p>
            <h2 className="text-2xl font-black text-emerald-600">
              Rp {Number(summary.income).toLocaleString("id-ID")}
            </h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pengeluaran</p>
            <h2 className="text-2xl font-black text-rose-600">
              Rp {Number(summary.expense).toLocaleString("id-ID")}
            </h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sisa Saldo Kas</p>
            <h2 className="text-2xl font-black text-indigo-600">
              Rp {Number(summary.balance).toLocaleString("id-ID")}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-800 mb-6">Perbandingan Bulanan</h2>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                  <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" name="Pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-800 mb-6">Tren Saldo Kas</h2>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    name="Saldo" 
                    stroke="#4f46e5" 
                    strokeWidth={4} 
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}