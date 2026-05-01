import axios from "../api/axios";
import api from "../api/axios";
import type { HousePayload } from "../types/house";

// export const getHouses = async () => {
//   const res = await api.get("/houses");
//   return res.data.data;
// };
export const getHouses = async ({ page = 1 }) => {
  const response = await api.get(`houses?page=${page}`);
  return response.data; 
};

export const createHouse = async (payload: HousePayload) => {
  return await api.post("/houses", payload);
};

export const updateHouse = async (id: number, payload: HousePayload) => {
  return await api.put(`/houses/${id}`, payload);
};

export const deleteHouse = async (id: number) => {
  return await api.delete(`/houses/${id}`);
};

export const assignResidentToHouse = async (houseid: number, payload: any) => {
  return await api.post(`/houses/${houseid}/assign-resident`, payload);
};
export const getAvailableResidents = async () => {
  const res = await api.get("/residents/available");
  return res.data.data;
}

export const checkoutResidentFromHouse = async (houseid: number, payload: { end_date: string }) => {
  return await api.post(`/houses/${houseid}/checkout-resident`, payload);
}

export const getHouseHistory = async (houseid: number) => {
  const res = await api.get(`/houses/${houseid}/history`);
  return res.data.data;
}