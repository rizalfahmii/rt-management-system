import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createResident,
  getResident,
  updateResident,
} from "../../services/resident.service";

export default function ResidentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    resident_status: "tetap",
    is_married: false,
    ktp_photo: null as File | null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (id) {
      getResident(id).then((res) => {
        setForm({
          full_name: res.full_name,
          phone: res.phone,
          resident_status: res.resident_status,
          is_married: res.is_married,
          ktp_photo: null,
        });

        if (res.ktp_photo) {
          setPreview(
            `http://localhost:8000/storage/${res.ktp_photo}`
          );
        }
      });
    }
  }, [id]);

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
    data.append("resident_status", form.resident_status);
    data.append("is_married", form.is_married ? "1" : "0");

    if (form.ktp_photo) {
      data.append("ktp_photo", form.ktp_photo);
    }

    try {
      if (id) {
        // Penting: Laravel butuh _method PUT jika kirim FormData lewat POST
        data.append("_method", "PUT"); 
        await updateResident(id, data);
      } else {
        await createResident(data);
      }

      navigate("/residents");
    } catch (error: any) {
      // Menampilkan detail error dari backend di console
      console.error("Error submit data:", error.response?.data || error);
      alert("Gagal menyimpan data. Cek console untuk detailnya.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">
        {id ? "Edit Resident" : "Tambah Resident"}
      </h1>

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <input
          className="w-full border p-3 rounded"
          placeholder="Nama Lengkap"
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
          <option value="tetap">Tetap</option>
          <option value="kontrak">Kontrak</option>
        </select>

        <select
          className="w-full border p-3 rounded"
          value={form.is_married ? "0" : "1"}
          onChange={(e) =>
            setForm({
              ...form,
              is_married:
                e.target.value === "0",
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
          onChange={handleFile}
          className="w-full border p-3 rounded"
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-40 h-28 object-cover rounded border"
          />
        )}

        <button className="bg-blue-600 text-white px-5 py-2 rounded">
          Simpan
        </button>
      </form>
    </div>
  );
}