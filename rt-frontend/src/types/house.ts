export interface House {
  id: number;
  house_number: string;
  house_status: "dihuni" | "kosong";
  notes?: string;
}

export interface HousePayload {
  house_number: string;
  house_status: "dihuni" | "kosong";
  notes?: string;
}
