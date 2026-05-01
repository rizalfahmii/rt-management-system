import { useEffect, useState } from "react";
import {
  createHouse,
  updateHouse,
} from "../../services/house.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: any;
}

export default function HouseModal({
  open,
  onClose,
  onSuccess,
  editData,
}: Props) {
  const [form, setForm] = useState({
    house_number: "",
    house_status: "kosong",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        house_number: editData.house_number,
        house_status: editData.house_status,
        notes: editData.notes || "",
      });
    } else {
      setForm({
        house_number: "",
        house_status: "kosong",
        notes: "",
      });
    }
  }, [editData, open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await updateHouse(editData.id, form);
      } else {
        await createHouse(form);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal simpan data");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-gray-800">
            {editData ? "Edit Unit Rumah" : "Tambah Unit Rumah"}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Nomor Rumah
            </label>
            <input
              required
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-semibold"
              placeholder="Contoh: A-01"
              value={form.house_number}
              onChange={(e) => setForm({ ...form, house_number: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Catatan Internal
            </label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              rows={3}
              placeholder="Tambahkan catatan jika perlu..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Simpan Data"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}