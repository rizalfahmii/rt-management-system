import api from "../api/axios";
import type { HousePayload } from "../types/house";

export const getHouses = async () => {
  const res = await api.get("/houses");
  return res.data.data;
};

export const createHouse = async (
  payload: HousePayload
) => {
  return await api.post("/houses", payload);
};

export const updateHouse = async (
  id: number,
  payload: HousePayload
) => {
  return await api.put(`/houses/${id}`, payload);
};

export const deleteHouse = async (
  id: number
) => {
  return await api.delete(`/houses/${id}`);
};