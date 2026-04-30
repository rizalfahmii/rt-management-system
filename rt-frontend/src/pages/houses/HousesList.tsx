import { useEffect, useState } from "react";
import {
  getHouses,
  deleteHouse,
} from "../../services/house.service";
import HouseModal from "../../components/houses/HouseModal";

export default function HouseList() {
  const [data, setData] = useState([]);
  const [open, setOpen] =
    useState(false);
  const [selected, setSelected] =
    useState<any>(null);

  const loadData = async () => {
    const res = await getHouses();
    setData(res);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (
    id: number
  ) => {
    const ok = confirm(
      "Yakin hapus rumah?"
    );
    if (!ok) return;

    await deleteHouse(id);
    loadData();
  };

  return (
    <div>
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold">
          Houses
        </h1>

        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Tambah
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                No Rumah
              </th>
              <th className="p-3 text-left">
                Status
              </th>
              <th className="p-3 text-left">
                Catatan
              </th>
              <th className="p-3 text-left">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item: any) => (
              <tr
                key={item.id}
                className="border-t"
              >
                <td className="p-3">
                  {
                    item.house_number
                  }
                </td>

                <td className="p-3">
                  {
                    item.house_status
                  }
                </td>

                <td className="p-3">
                  {item.notes ||
                    "-"}
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() => {
                      setSelected(
                        item
                      );
                      setOpen(
                        true
                      );
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        item.id
                      )
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HouseModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        onSuccess={loadData}
        editData={selected}
      />
    </div>
  );
}