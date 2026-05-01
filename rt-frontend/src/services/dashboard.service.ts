import api from "../api/axios";

export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};
export const getDashboardChart = async (year?: number) => {
  const res = await api.get("/dashboard/chart", {
    params: { year },
  });

  return res.data;
};