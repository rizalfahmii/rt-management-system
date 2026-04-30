export interface Resident {
  id: number;
  full_name: string;
  phone: string;
  resident_status: "tetap" | "kontrak";
  is_married: boolean;
  ktp_photo?: string;
}

export interface ResidentPayload {
  full_name: string;
  phone: string;
  resident_status: "tetap" | "kontrak";
  is_married: boolean;
  ktp_photo?: File|null;
}
