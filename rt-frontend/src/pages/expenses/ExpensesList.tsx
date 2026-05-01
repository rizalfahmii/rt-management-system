import { useEffect, useState, useCallback } from "react";
import {
  getExpenses,
  createExpense,
  deleteExpense,
} from "../../services/expense.service";
import ExpenseModal from "../../components/expense/ExpenseModal";

export default function ExpenseListPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    expense_date: "",
    category: "",
  });

const loadData = useCallback(async (page = 1) => {
  setLoading(true);
  try {
    const res = await getExpenses({ page });
    
    // Cek apakah response punya struktur pagination (res.data.data)
    if (res && res.data && Array.isArray(res.data.data)) {
      setExpenses(res.data.data); // Ambil array di dalam objek data
      setCurrentPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);
    } 
    // Fallback jika API kamu tidak pakai pagination (langsung res.data)
    else if (res && Array.isArray(res.data)) {
      setExpenses(res.data);
    }
  } catch (error) {
    console.error("Gagal load data:", error);
    setExpenses([]);
  } finally {
    setLoading(false);
  }
}, []);;

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createExpense(form);
      setForm({ title: "", amount: "", expense_date: "", category: "" });
      setIsModalOpen(false);
      loadData(1);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {     
         await deleteExpense(id);
      loadData(currentPage);
    } catch (error) {
      alert("Gagal menghapus data.");
    } 
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Pengeluaran Kas</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
          >
            + Tambah Pengeluaran
          </button>
        </div>

        {/* Panggil Komponen Modal */}
        <ExpenseModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          loading={loading}
        />

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nominal</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </td>
                  </tr>
                ) : Array.isArray(expenses) && expenses.length > 0 ? (
                  expenses.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">{item.title}</td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          {item.category || 'Umum'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{item.expense_date}</td>
                      <td className="px-6 py-4 font-mono font-bold text-red-600">
                        - Rp {Number(item.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-sm transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                      Belum ada data pengeluaran.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!loading && expenses.length > 0 && (
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
    </div>
  );
}