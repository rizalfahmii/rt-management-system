import { useEffect, useState, useCallback } from "react";
import { getResident, deleteResident } from "../../services/resident.service";
import type { Resident } from "../../types/resident";
import toast from "react-hot-toast";
import ResidentModal from "../../components/resident/ResidentModal";

export default function ResidentList() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Resident | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchResidents = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await getResident({ page });
      const result = response.data;

      if (result) {
        setResidents(result.data || []);
        setCurrentPage(result.current_page || 1);
        setLastPage(result.last_page || 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResidents(currentPage);
  }, [currentPage, fetchResidents]);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await deleteResident(id);
      toast.success("Data dihapus");
      fetchResidents(currentPage);
    } catch (error) {
      toast.error("Gagal menghapus");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Daftar Penghuni
            </h1>
            <p className="text-slate-500 mt-1">
              Kelola data informasi penduduk dan status kependudukan warga.
            </p>
          </div>
          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95"
          >
            + Tambah Penghuni
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Profil / KTP
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    No. Telepon
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-slate-500 font-medium">
                        Memuat data...
                      </p>
                    </td>
                  </tr>
                ) : residents.length > 0 ? (
                  residents.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                     <td className="px-6 py-4">
                        {item.ktp_photo ? (
                          <img
                            src={`http://localhost:8000/storage/${item.ktp_photo}`}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            alt="KTP"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="p-5">
                        <span className="text-slate-600 font-medium">
                          {item.phone}
                        </span>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                            item.resident_status === "tetap"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.resident_status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelected(item);
                              setOpen(true);
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-20 text-center text-slate-400 italic"
                    >
                      Tidak ada data penghuni yang terdaftar
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-5 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm font-medium text-slate-500">
              Halaman{" "}
              <span className="text-slate-900 font-bold">{currentPage}</span>{" "}
              dari <span className="text-slate-900 font-bold">{lastPage}</span>
            </div>
            <div className="flex gap-3">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-5 py-2 text-sm font-bold border border-slate-300 rounded-xl bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition shadow-sm"
              >
                Previous
              </button>
              <button
                disabled={currentPage === lastPage || loading}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-5 py-2 text-sm font-bold border border-slate-300 rounded-xl bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResidentModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => fetchResidents(currentPage)}
        editData={selected}
      />
    </div>
  );
}
