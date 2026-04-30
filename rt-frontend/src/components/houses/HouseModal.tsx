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

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      if (editData) {
        await updateHouse(
          editData.id,
          form
        );
      } else {
        await createHouse(form);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal simpan data");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
        <div className="flex justify-between mb-5">
          <h2 className="text-xl font-bold">
            {editData
              ? "Edit Rumah"
              : "Tambah Rumah"}
          </h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <input
            className="w-full border p-3 rounded"
            placeholder="Nomor Rumah"
            value={form.house_number}
            onChange={(e) =>
              setForm({
                ...form,
                house_number:
                  e.target.value,
              })
            }
          />

          <select
            className="w-full border p-3 rounded"
            value={form.house_status}
            onChange={(e) =>
              setForm({
                ...form,
                house_status:
                  e.target.value as
                    | "dihuni"
                    | "kosong",
              })
            }
          >
            <option value="kosong">
              Kosong
            </option>
            <option value="dihuni">
              Dihuni
            </option>
          </select>

          <textarea
            className="w-full border p-3 rounded"
            rows={4}
            placeholder="Catatan"
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes:
                  e.target.value,
              })
            }
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-2 rounded"
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