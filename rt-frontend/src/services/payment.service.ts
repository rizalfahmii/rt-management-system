import api from "../api/axios";

export const getPayments = async (params?: {
  month?: string;
  year?: string;
}) => {
  const res = await api.get("/payments", {
    params,
  });

  return res.data.data;
};

export const generatePayments = async (payload: {
  month: number;
  year: number;
}) => {
  return await api.post("/payments/generate", payload);
};

export const confirmPayment = async (id: number) => {
  return await api.post(`/payments/${id}/pay`);
};
export const payYearlyCleaning = async (
  payload: {
    resident_id: number;
    house_id: number;
    year: number;
  }
) => {
  const res = await api.post(
    "/payments/pay-yearly-cleaning",
    payload
  );

  return res.data;
};
