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

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    data.append(
      "resident_status",
      form.resident_status
    );
    data.append(
      "is_married",
      form.is_married ? "1" : "0"
    );

    if (form.ktp_photo) {
      data.append("ktp_photo", form.ktp_photo);
    }

    try {
      if (editData) {
        data.append("_method", "PUT");
        await updateResident(editData.id, data);
      } else {
        await createResident(data);
        toast.success("berhasil membuat data resident!")
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6">
        <div className="flex justify-between mb-5">
          <h2 className="text-xl font-bold">
            {editData
              ? "Edit Resident"
              : "Tambah Resident"}
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <input
            className="w-full border p-3 rounded"
            placeholder="Nama Lengkap"
            required
            value={form.full_name}
            onChange={(e) =>
              setForm({
                ...form,
                full_name: e.target.value,
              })
            }
          />

          <input
            className="w-full border p-3 rounded"
            placeholder="Nomor Telepon"
            value={form.phone}
            required
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />

          <select
            className="w-full border p-3 rounded"
            value={form.resident_status}
            onChange={(e) =>
              setForm({
                ...form,
                resident_status:
                  e.target.value as
                    | "tetap"
                    | "kontrak",
              })
            }
          >
            <option value="tetap">
              Tetap
            </option>
            <option value="kontrak">
              Kontrak
            </option>
          </select>

          <select
            className="w-full border p-3 rounded"
            value={
              form.is_married
                ? "1"
                : "0"
            }
            onChange={(e) =>
              setForm({
                ...form,
                is_married:
                  e.target.value ===
                  "1",
              })
            }
          >
            <option value="0">
              Belum Menikah
            </option>
            <option value="1">
              Sudah Menikah
            </option>
          </select>

          <input
            type="file"
            accept="image/*"
            required
            onChange={handleFile}
            className="w-full border p-3 rounded"
          />

          {preview && (
            <img
              src={preview}
              className="w-40 h-28 rounded object-cover border"
            />
          )}

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded border"
            >
              Batal
            </button>

            <button className="bg-blue-600 text-white px-5 py-2 rounded">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}