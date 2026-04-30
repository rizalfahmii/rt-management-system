import api from "../api/axios"; 
import type { ResidentPayload } from "../types/resident";


export const getResident = async() => {
    const res = await api.get("/residents");
    return res.data.data;
}


export const getDetailResident = async(id: number) => {
   const res = await api.get(`/residents/${id}`);
   return res.data.data;
}

export const createResident = async(payload: ResidentPayload) => {
 return await api.post('/residents', payload,{
    headers: {
        "Content-Type": "multipart/form-data"
    }
 })

}

export const deleteResident = async(id: number) => {
    return await api.delete(`/residents/${id}`)
}

export const updateResident = async(payload: ResidentPayload, id: number) => {
    return await api.put(`/residents/${id}`, payload)
}