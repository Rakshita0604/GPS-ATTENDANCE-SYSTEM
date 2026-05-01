import { apiRequest } from "./api";

export interface Employee {
  id: number;
  user_id?: number;
  employee_code: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  designation?: string;
  status: "active" | "inactive";
  created_at?: string;
}

export type EmployeeInput = Omit<Employee, "id" | "user_id" | "created_at"> & {
  password?: string;
};

export function getEmployees() {
  return apiRequest<Employee[]>("/employees", "GET");
}

export function createEmployee(data: EmployeeInput) {
  return apiRequest<Employee>("/employees", "POST", data);
}

export function updateEmployee(id: number, data: EmployeeInput) {
  return apiRequest<{ message: string }>(`/employees/${id}`, "PUT", data);
}

export function deleteEmployee(id: number) {
  return apiRequest<{ message: string }>(`/employees/${id}`, "DELETE");
}
