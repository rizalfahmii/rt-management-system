import { useEffect, useState } from "react";
import { getAvailableResidents } from "../../services/house.service";
import { assignResidentToHouse } from "../../services/house.service";
import toast from "react-hot-toast";

export default function AssignResidentModal({
  open,
  onClose,
  house,
  onSuccess,
}: any) {
  const [residents, setResidents] = useState([]);
  const [residentId, setResidentId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && house) {
      getAvailableResidents().then((res) => {
        setResidents(Array.isArray(res) ? res : res.data || []);
      });
    }
  }, [open, house]);

  const submit = async () => {
    if (!residentId || !startDate) {
      return toast.error("Pilih penduduk dan tanggal mulai!");
    }

    setLoading(true);
    try {
      await assignResidentToHouse(house?.id, {
        resident_id: residentId,
        start_date: startDate,
      });

      toast.success("Berhasil assign penduduk!, Rumah sudah berpenghuni");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Gagal assign penduduk.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!open || !house) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-extrabold text-gray-800">Assign Penghuni</h2>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-0.5">
              Rumah Nomor: {house?.house_number}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Pilih Penduduk
            </label>
            <select
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-semibold text-gray-700"
              value={residentId}
              onChange={(e) => setResidentId(e.target.value)}
            >
              <option value="">-- Pilih Penduduk Tersedia --</option>
              {residents.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Tanggal Mulai Menetap
            </label>
            <input
              type="date"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-semibold text-gray-700"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>

            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Konfirmasi"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}