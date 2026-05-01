import { useEffect, useState, useCallback } from "react";
import {
  getPayments,
  generatePayments,
  confirmPayment,
  payYearlyCleaning,
} from "../../services/payment.service";
import toast from "react-hot-toast";

const YearlyPaymentButton = ({
  residentId,
  houseId,
  year,
  onSuccess,
}: any) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (
      !window.confirm(
        `Lunasi seluruh iuran kebersihan untuk tahun ${year}?`
      )
    )
      return;

    setLoading(true);

    try {
      await payYearlyCleaning({
        resident_id: residentId,
        house_id: houseId,
        year: Number(year),
      });

      toast.success(
        `Pembayaran tahunan ${year} berhasil`
      );

      onSuccess();
    } catch (error) {
      toast.error("Gagal bayar tahunan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-bold transition shadow-sm disabled:opacity-50"
    >
      {loading ? "..." : "Bayar Setahun"}
    </button>
  );
};

export default function PaymentListPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);
  const [lastPage, setLastPage] =
    useState(1);

  const now = new Date();

  const [month, setMonth] = useState(
    String(now.getMonth() + 1)
  );

  const [year, setYear] = useState(
    String(now.getFullYear())
  );

  const months = [
    { id: "", name: "Semua Bulan" },
    { id: "1", name: "Januari" },
    { id: "2", name: "Februari" },
    { id: "3", name: "Maret" },
    { id: "4", name: "April" },
    { id: "5", name: "Mei" },
    { id: "6", name: "Juni" },
    { id: "7", name: "Juli" },
    { id: "8", name: "Agustus" },
    { id: "9", name: "September" },
    { id: "10", name: "Oktober" },
    { id: "11", name: "November" },
    { id: "12", name: "Desember" },
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) =>
      String(now.getFullYear() - 2 + i)
  );

  const loadData = useCallback(
    async (
      page = 1,
      currentMonth = month,
      currentYear = year
    ) => {
      setLoading(true);

      try {
        const res = await getPayments({
          page,
          month:
            currentMonth || undefined,
          year:
            currentYear || undefined,
        });

        if (Array.isArray(res)) {
          setPayments(res);
          setCurrentPage(1);
          setLastPage(1);
        } else if (res?.data) {
          setPayments(res.data);
          setCurrentPage(
            res.current_page || 1
          );
          setLastPage(
            res.last_page || 1
          );
        } else {
          setPayments([]);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          "Gagal mengambil data pembayaran"
        );
      } finally {
        setLoading(false);
      }
    },
    [month, year]
  );

  useEffect(() => {
    loadData(1, month, year);
  }, []);

  const handleSearch = () => {
    loadData(1, month, year);
  };

  const handleReset = () => {
    setMonth("");
    setYear("");
    loadData(1, "", "");
  };

  const handleGenerate =
    async () => {
      if (!month || !year) {
        toast.error(
          "Pilih bulan dan tahun"
        );
        return;
      }

      if (
        !window.confirm(
          `Generate tagihan ${month}/${year}?`
        )
      )
        return;

      try {
        setLoading(true);

        await generatePayments({
          month: Number(month),
          year: Number(year),
        });

        toast.success(
          "Tagihan berhasil digenerate"
        );

        loadData(
          1,
          month,
          year
        );
      } catch (error) {
        toast.error(
          "Gagal generate tagihan"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleConfirm =
    async (id: number) => {
      if (
        !window.confirm(
          "Konfirmasi pembayaran ini?"
        )
      )
        return;

      try {
        await confirmPayment(id);

        toast.success(
          "Pembayaran dikonfirmasi"
        );

        loadData(
          currentPage,
          month,
          year
        );
      } catch (error) {
        toast.error(
          "Gagal konfirmasi"
        );
      }
    };

  const isCleaning = (item: any) =>
    item.payment_type?.name
      ?.toLowerCase()
      .includes("kebersihan");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Manajemen Pembayaran
            </h1>
            <p className="text-gray-500 mt-1">
              Pantau iuran bulanan dan
              kelola status pembayaran
              warga.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : "Generate Tagihan"}
          </button>
        </div>

        {/* FILTER */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Periode Bulan
              </label>

              <select
                value={month}
                onChange={(e) =>
                  setMonth(
                    e.target.value
                  )
                }
                className="w-full border-gray-300 rounded-xl bg-gray-50 p-3 focus:ring-2 focus:ring-indigo-500 outline-none border transition"
              >
                {months.map((m) => (
                  <option
                    key={m.id}
                    value={m.id}
                  >
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Tahun
              </label>

              <select
                value={year}
                onChange={(e) =>
                  setYear(
                    e.target.value
                  )
                }
                className="w-full border-gray-300 rounded-xl bg-gray-50 p-3 focus:ring-2 focus:ring-indigo-500 outline-none border transition"
              >
                <option value="">
                  Semua Tahun
                </option>

                {years.map((y) => (
                  <option
                    key={y}
                    value={y}
                  >
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={
                  handleSearch
                }
                className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition shadow-sm"
              >
                Filter
              </button>

              <button
                onClick={
                  handleReset
                }
                className="bg-white border border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Rumah
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Penghuni
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Tipe Iuran
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Periode
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Nominal
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : payments.length >
                  0 ? (
                  payments.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-indigo-50/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                            {
                              item
                                .house
                                ?.house_number
                            }
                          </span>
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {
                            item
                              .resident
                              ?.full_name
                          }
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <span>
                              {
                                item
                                  .payment_type
                                  ?.name
                              }
                            </span>

                            {isCleaning(
                              item
                            ) && (
                              <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">
                                Bisa Tahunan
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-500">
                          {
                            months.find(
                              (
                                m
                              ) =>
                                m.id ===
                                String(
                                  item.month
                                )
                            )?.name
                          }{" "}
                          {
                            item.year
                          }
                        </td>

                        <td className="px-6 py-4 font-mono font-bold text-gray-700">
                          Rp{" "}
                          {Number(
                            item.amount
                          ).toLocaleString(
                            "id-ID"
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              item.status ===
                              "lunas"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {item.status ===
                            "lunas"
                              ? "Lunas"
                              : "Belum Bayar"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {item.status ===
                              "belum" &&
                              isCleaning(
                                item
                              ) &&
                              item.month ===
                                1 && (
                                <YearlyPaymentButton
                                  residentId={
                                    item
                                      .resident
                                      ?.id
                                  }
                                  houseId={
                                    item
                                      .house
                                      ?.id
                                  }
                                  year={
                                    item.year
                                  }
                                  onSuccess={() =>
                                    loadData(
                                      currentPage,
                                      month,
                                      year
                                    )
                                  }
                                />
                              )}

                            {item.status ===
                              "belum" && (
                              <button
                                onClick={() =>
                                  handleConfirm(
                                    item.id
                                  )
                                }
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-bold transition shadow-sm"
                              >
                                Konfirmasi
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-20 text-center text-gray-400"
                    >
                      Tidak ada data
                      ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!loading &&
            payments.length >
              0 && (
              <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">
                  Halaman{" "}
                  <span className="text-gray-900 font-bold">
                    {
                      currentPage
                    }
                  </span>{" "}
                  dari{" "}
                  <span className="text-gray-900 font-bold">
                    {lastPage}
                  </span>
                </span>

                <div className="flex gap-2">
                  <button
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      loadData(
                        currentPage -
                          1,
                        month,
                        year
                      )
                    }
                    className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>

                  <button
                    disabled={
                      currentPage ===
                      lastPage
                    }
                    onClick={() =>
                      loadData(
                        currentPage +
                          1,
                        month,
                        year
                      )
                    }
                    className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 disabled:opacity-50"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}