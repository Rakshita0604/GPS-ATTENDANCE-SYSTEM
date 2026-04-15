import { apiRequest } from "./api";

export const loginUser = async (data: any) => {
  return apiRequest("/auth/login", "POST", data);
};

export const registerUser = async (data: any) => {
  return apiRequest("/auth/register", "POST", data);
};