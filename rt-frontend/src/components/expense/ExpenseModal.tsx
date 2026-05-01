interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: {
    title: string;
    amount: string;
    expense_date: string;
    category: string;
  };
  setForm: (form: any) => void;
  loading: boolean;
}

export default function ExpenseModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  form, 
  setForm, 
  loading 
}: ExpenseModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Tambah Pengeluaran</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul</label>
            <input
              placeholder="Contoh: Bayar Listrik"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border-gray-300 rounded-xl bg-gray-50 p-3 focus:ring-2 focus:ring-blue-500 outline-none border transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nominal (Rp)</label>
            <input
              type="number"
              placeholder="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full border-gray-300 rounded-xl bg-gray-50 p-3 focus:ring-2 focus:ring-blue-500 outline-none border transition font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={form.expense_date}
              onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
              className="w-full border-gray-300 rounded-xl bg-gray-50 p-3 focus:ring-2 focus:ring-blue-500 outline-none border transition text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
            <input
              placeholder="Perbaikan, Kebersihan, dll"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border-gray-300 rounded-xl bg-gray-50 p-3 focus:ring-2 focus:ring-blue-500 outline-none border transition"
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}