import { useEffect, useState, useRef } from "react";
import { getMonthlyReport } from "../../services/report.service";
import jsPDF from "jspdf";
import { exportPaymentCsv } from "../../services/report.service";
export default function MonthlyReportPage() {
  const now = new Date();
  const printRef = useRef<HTMLDivElement>(null);

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const months = [
    { id: 1, name: "Januari" }, { id: 2, name: "Februari" }, { id: 3, name: "Maret" },
    { id: 4, name: "April" }, { id: 5, name: "Mei" }, { id: 6, name: "Juni" },
    { id: 7, name: "Juli" }, { id: 8, name: "Agustus" }, { id: 9, name: "September" },
    { id: 10, name: "Oktober" }, { id: 11, name: "November" }, { id: 12, name: "Desember" }
  ];

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getMonthlyReport(month, year);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

const handleExport = async () => {
  try {
    setLoading(true);

    await exportPaymentCsv();

    toast.success("Laporan berhasil didownload");
  } catch (error) {
    console.error(error);
    toast.error("Gagal export laporan");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    loadData();
  }, []);

  if (!data && loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Laporan Bulanan</h1>
            <p className="text-gray-500 mt-1">Ringkasan arus kas masuk dan keluar periode ini.</p>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border-none bg-transparent text-sm font-semibold focus:ring-0 px-4 cursor-pointer"
            >
              {months.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border-none bg-transparent text-sm font-semibold focus:ring-0 px-4 cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={loadData}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition disabled:opacity-50"
              >
                {loading ? "..." : "Filter"}
              </button>
              <button
                onClick={handleExport}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition"
              >
                Export Laporan
              </button>
            </div>
          </div>
        </div>

        <div ref={printRef} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Pemasukan</p>
              <h2 className="text-2xl font-black text-emerald-600">
                Rp {Number(data?.summary?.income || 0).toLocaleString("id-ID")}
              </h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Pengeluaran</p>
              <h2 className="text-2xl font-black text-rose-600">
                Rp {Number(data?.summary?.expense || 0).toLocaleString("id-ID")}
              </h2>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Saldo Akhir</p>
              <h2 className="text-2xl font-black text-indigo-600">
                Rp {Number(data?.summary?.balance || 0).toLocaleString("id-ID")}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-gray-800">Detail Pemasukan</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rumah</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Warga</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data?.payments?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-black text-indigo-700">{item.house?.house_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.resident?.full_name}</td>
                        <td className="px-6 py-4 text-sm font-mono font-bold text-right text-emerald-600">
                          {Number(item.amount).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-gray-800">Detail Pengeluaran</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Keterangan</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data?.expenses?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{item.title}</td>
                        <td className="px-6 py-4 text-sm font-mono font-bold text-right text-rose-600">
                          {Number(item.amount).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}