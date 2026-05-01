import { useEffect, useState, useCallback } from "react";
import { getHouses, deleteHouse } from "../../services/house.service";
import HouseModal from "../../components/houses/HouseModal";
import AssignResidentModal from "../../components/houses/AssignResidentModal";
import CheckoutResidentModal from "../../components/houses/CheckoutResidentModal";
import { Link } from "react-router-dom";

export default function HouseList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  // Selection States
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const loadData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await getHouses({ page });
      // Sesuaikan dengan struktur res.data.data karena menggunakan paginate()
      if (res && res.data && Array.isArray(res.data.data)) {
        setData(res.data.data);
        setCurrentPage(res.data.current_page || 1);
        setLastPage(res.data.last_page || 1);
      } else if (res && Array.isArray(res.data)) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data rumah:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus rumah ini?")) return;
    try {
      await deleteHouse(id);
      loadData(currentPage);
    } catch (error) {
      alert("Gagal menghapus data.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Daftar Rumah</h1>
            <p className="text-gray-500 mt-1">Manajemen status dan penghuni unit rumah.</p>
          </div>
          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg active:scale-95"
          >
            + Tambah Rumah
          </button>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">No Rumah</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Catatan</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Aksi</th>
                </tr>
              </thead>
          <tbody className="divide-y divide-gray-100">
  {loading ? (
    <tr>
      <td colSpan={4} className="px-6 py-12 text-center">
        <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </td>
    </tr>
  ) : data.length > 0 ? (
    data.map((item: any) => (
      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 font-bold text-gray-800">{item.house_number}</td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            item.house_status === 'dihuni' 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-amber-100 text-amber-700'
          }`}>
            {item.house_status}
          </span>
        </td>
        <td className="px-6 py-4 text-gray-500 text-sm italic">{item.notes || "-"}</td>
        <td className="px-6 py-4 text-right">
          <div className="flex justify-end gap-2">
            {/* Tombol Edit */}
            <button
              onClick={() => { setSelected(item); setOpen(true); }}
              className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              Edit
            </button>
            
            {/* Tombol Kontekstual (Assign/Checkout) */}
            {item.house_status !== "dihuni" ? (
              <button
                onClick={() => { setSelected(item); setAssignOpen(true); }}
                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Assign
              </button>
            ) : (
              <button
                onClick={() => { setSelectedHouse(item); setCheckoutOpen(true); }}
                className="bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Checkout
              </button>
            )}

            {/* Tombol History */}
            <Link
              to={`/houses/${item.id}/history`}
              className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              History
            </Link>

            {/* Tombol Hapus */}
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-50 text-red-500 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              Hapus
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
        Tidak ada data rumah yang ditemukan.
      </td>
    </tr>
  )}
</tbody>
            </table>
          </div>

          {/* PAGINATION (Konsisten dengan sebelumnya) */}
          {!loading && data.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Halaman <span className="font-bold text-gray-900">{currentPage}</span> dari <span className="font-bold text-gray-900">{lastPage}</span>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => loadData(currentPage - 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  Prev
                </button>
                <button
                  disabled={currentPage === lastPage}
                  onClick={() => loadData(currentPage + 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <HouseModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => loadData(currentPage)}
        editData={selected}
      />
      <AssignResidentModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        onSuccess={() => loadData(currentPage)}
        house={selected}
      />
      <CheckoutResidentModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => loadData(currentPage)}
        house={selectedHouse}
      />
    </div>
  );
}