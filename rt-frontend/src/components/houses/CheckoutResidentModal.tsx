import { useState } from "react";
import { checkoutResidentFromHouse } from "../../services/house.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  house: any;
}

export default function CheckoutResidentModal({
  open,
  onClose,
  onSuccess,
  house,
}: Props) {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [endDate, setEndDate] =
    useState(today);

  const [loading, setLoading] =
    useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      await checkoutResidentFromHouse(
        house.id,
        {
          end_date: endDate,
        }
      );

      onSuccess();
      onClose();
    } catch (error: any) {
      alert(
        error.response?.data
          ?.message ||
          "Gagal checkout"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        <div className="flex justify-between mb-5">
          <h2 className="text-xl font-bold">
            Checkout Resident
          </h2>

          <button onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">
              Rumah
            </label>

            <div className="font-semibold">
              {house.house_number}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Tanggal Keluar
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className="w-full border p-3 rounded mt-1"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="border px-5 py-2 rounded w-full"
            >
              Batal
            </button>

            <button
              onClick={submit}
              disabled={loading}
              className="bg-red-600 text-white px-5 py-2 rounded w-full"
            >
              {loading
                ? "Proses..."
                : "Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}