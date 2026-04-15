const BASE_URL = "http://localhost:5000/api";

// 🔥 MARK ATTENDANCE (FORM DATA)
export const markAttendance = async (formData: FormData) => {
  const res = await fetch(`${BASE_URL}/attendance/mark`, {
    method: "POST",
    body: formData, // ✅ no JSON
  });

  return res.json();
};

// 🔍 GET HISTORY
export const getDashboardData = async (userId: number) => {
  return apiRequest(`/attendance/dashboard/${userId}`, "GET");
};

// get attendance history
export const getAttendanceHistory = async (userId: number) => {
  return apiRequest(`/attendance?user_id=${userId}`, "GET");
};