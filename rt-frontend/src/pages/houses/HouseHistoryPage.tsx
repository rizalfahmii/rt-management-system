import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getHouseHistory } from "../../services/house.service";

export default function HouseHistoryPage() {
  const { id } = useParams();
  const [house, setHouse] = useState<any>(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getHouseHistory(Number(id));
      setHouse(res.house || {});
      setData(Array.isArray(res) ? res : res.history || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const calcDuration = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} Hari`;
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Link to="/houses" className="text-indigo-600 hover:text-indigo-700 font-bold text-sm flex items-center gap-1 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali
              </Link>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              History Rumah <span className="text-indigo-600">{house?.house_number || `#${id}`}</span>
            </h1>
            <p className="text-slate-500 mt-1">Lacak jejak riwayat huni dan durasi tinggal penduduk.</p>
          </div>
          
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
             <div className={`h-3 w-3 rounded-full ${house?.is_occupied ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
             <span className="text-sm font-bold text-slate-700">{house?.is_occupied ? 'Terisi' : 'Kosong'}</span>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Penghuni</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Periode Masuk</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Periode Keluar</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Durasi</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-slate-500 font-medium">Menarik data riwayat...</p>
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shrink-0">
                            {item.resident?.full_name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{item.resident?.full_name || 'Tidak diketahui'}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">NIK: {item.resident_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-slate-600 font-semibold">{item.start_date}</span>
                      </td>
                      <td className="p-5">
                        <span className="text-slate-600 font-semibold">{item.end_date || "-"}</span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                           <span className="text-slate-700 font-bold">{calcDuration(item.start_date, item.end_date)}</span>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        {item.is_active ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Aktif Menghuni
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
                            Sudah Keluar
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="bg-slate-50 inline-block p-4 rounded-full mb-3 text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-slate-400 italic font-medium">Belum ada riwayat huni untuk rumah ini.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-5 bg-slate-50/50 border-t border-slate-200">
             <p className="text-xs text-slate-400 font-medium italic">
                * Durasi dihitung berdasarkan selisih tanggal masuk dan tanggal keluar (atau hari ini jika masih aktif).
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}