  import { useEffect, useState } from "react";
  import {
    createResident,
    updateResident,
  } from "../../services/resident.service";
  import toast from "react-hot-toast";

  interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: any;
  }

  export default function ResidentModal({
    open,
    onClose,
    onSuccess,
    editData,
  }: Props) {
    const [form, setForm] = useState({
      full_name: "",
      phone: "",
      resident_status: "tetap",
      is_married: false,
      ktp_photo: null as File | null,
    });

    const [preview, setPreview] = useState("");

    useEffect(() => {
      if (editData) {
        setForm({
          full_name: editData.full_name,
          phone: editData.phone,
          resident_status: editData.resident_status,
          is_married: editData.is_married,
          ktp_photo: null,
        });

        if (editData.ktp_photo) {
          setPreview(
            `http://localhost:8000/storage/${editData.ktp_photo}`
          );
        }
      } else {
        setForm({
          full_name: "",
          phone: "",
          resident_status: "tetap",
          is_married: false,
          ktp_photo: null,
        });
        setPreview("");
      }
    }, [editData, open]);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setForm({ ...form, ktp_photo: file });
      setPreview(URL.createObjectURL(file));
    };

    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      const data = new FormData();
      data.append("full_name", form.full_name);
      data.append("phone", form.phone);
      data.append("resident_status", form.resident_status);
      data.append("is_married", form.is_married ? "1" : "0");

      if (form.ktp_photo) {
        data.append("ktp_photo", form.ktp_photo);
      }

      try {
        if (editData) {
          data.append("_method", "PUT");
          await updateResident(editData.id, data);
          toast.success("Data berhasil diperbarui!");
        } else {
          await createResident(data);
          toast.success("Berhasil membuat data resident!");
        }
        onSuccess();
        onClose();
      } catch (error) {
        console.error(error);
        toast.error("Gagal menyimpan data");
      }
    };

    if (!open) return null;

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-slate-800">
              {editData ? "Edit Resident" : "Tambah Resident Baru"}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={submit} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Nama Lengkap</label>
              <input
                className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-800"
                placeholder="Masukkan nama lengkap..."
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Nomor Telepon</label>
              <input
                className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-800"
                placeholder="Contoh: 08123456789"
                value={form.phone}
                required
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Status Hunian</label>
                <select
                  className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-medium"
                  value={form.resident_status}
                  onChange={(e) => setForm({ ...form, resident_status: e.target.value })}
                >
                  <option value="tetap">Tetap</option>
                  <option value="kontrak">Kontrak</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Status Pernikahan</label>
                <select
                  className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-medium"
                  value={form.is_married ? "1" : "0"}
                  onChange={(e) => setForm({ ...form, is_married: e.target.value === "1" })}
                >
                  <option value="0">Belum Menikah</option>
                  <option value="1">Sudah Menikah</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Foto KTP</label>
              <div className="flex items-start gap-4">
                <div className="relative group flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    required={!editData}
                    onChange={handleFile}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-dashed border-slate-300 p-4 rounded-xl"
                  />
                </div>
                {preview && (
                  <div className="shrink-0">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-24 h-16 rounded-lg object-cover border-2 border-indigo-100 shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-3 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button className="flex-[2] bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95">
                Simpan Data
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }