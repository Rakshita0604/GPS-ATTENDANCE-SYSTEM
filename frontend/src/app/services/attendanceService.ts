import { apiRequest } from "./api";

export interface AttendanceRecord {
  id: number;
  user_id: number;
  attendance_date: string;
  check_in: string | null;
  check_out: string | null;
  image: string | null;
  latitude: string;
  longitude: string;
  status: "present" | "late";
  employee_code?: string;
  name?: string;
  email?: string;
}

export function markAttendance(formData: FormData) {
  return apiRequest<{ message: string }>("/attendance/mark", "POST", formData);
}

export function getDashboardData() {
  return apiRequest<any>("/attendance/dashboard", "GET");
}

export function getAttendanceHistory() {
  return apiRequest<AttendanceRecord[]>("/attendance/history", "GET");
}

export function saveOfficeLocation(data: { lat: string; lng: string; radius: string }) {
  return apiRequest<{ message: string }>("/admin/config", "PUT", data);
}

export function getOfficeLocation() {
  return apiRequest<{ lat: string; lng: string; radius: string | number }>("/admin/config", "GET");
}
