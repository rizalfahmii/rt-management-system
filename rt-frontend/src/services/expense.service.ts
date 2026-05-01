import api from "../api/axios";

export const getExpenses = async () => {
  const res = await api.get("/expenses");
  return res.data;
};

export const createExpense = async (data: any) => {
  return await api.post("/expenses", data);
};

export const deleteExpense = async (id: number) => {
  return await api.delete(`/expenses/${id}`);
};