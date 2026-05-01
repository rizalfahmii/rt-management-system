import api from "../api/axios";

export const getMonthlyReport = async (
  month: number,
  year: number
) => {
  const res = await api.get("/reports/monthly-detail", {
    params: { month, year },
  });

  return res.data;
};
export const exportPaymentCsv = async () => {
  const res = await api.get("/reports/payments/export-csv", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "laporan-pembayaran.csv");

  document.body.appendChild(link);
  link.click();
  link.remove();
};