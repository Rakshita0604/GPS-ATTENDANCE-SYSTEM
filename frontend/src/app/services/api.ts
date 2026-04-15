const BASE_URL = "http://localhost:5000/api";

export const apiRequest = async (endpoint: string, method: string, data?: any) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  return res.json();
};