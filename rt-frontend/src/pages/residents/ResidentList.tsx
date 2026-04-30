import { useEffect, useState } from "react";
import { getResident, deleteResident } from "../../services/Resident.service";
import type { Resident } from "../../types/resident";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ResidentModal from "../../components/resident/ResidentModal";

export default function ResidentList() {
  const [data, setData] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const loadData = async () => {
    try {
      const result = await getResident();
      setData(result.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = confirm("yakin menghapus data?");
    if (!ok) return;
    await deleteResident(id);
    toast.success("Data berhasil dihapus!");
    loadData();
  };
  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <p>Loading....</p>;

  return (
    <div>
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold">Residents</h1>
       <button onClick={() => {
        setSelected(null);
        setOpen(true);
       }} className="bg-blue-600 text-wgite px-4 py-2"> + Tambah</button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 tex-left">Foto</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Telepon</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Menikah</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">
                  {item.ktp_photo ? (
                    <img
                      src={`http://localhost:8000/storage/${item.ktp_photo}`}
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-3">{item.full_name}</td>
                <td className="p-3">{item.phone}</td>
                <td className="p-3">{item.resident_status}</td>
                <td className="p-3">{item.is_married ? "Ya" : "Tidak"}</td>
                <td className="p-3 space-x-2">
                  <Link
                    to={`/residents/${item.id}/edit`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="p-5 text-center">
                  Belum ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ResidentModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        onSuccess={loadData}
        editData={selected}
      />
      </div>
    </div>
  );
}
