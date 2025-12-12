import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User management
export const userApi = {
  getAllUsers: () => api.get("/admin/users"),
  getUser: (id: string) => api.get(`/user/${id}`),
  updateUser: (id: string, data: any) => api.put(`/user/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  banUser: (id: string) => api.post(`/admin/users/${id}/ban`),
  unbanUser: (id: string) => api.post(`/admin/users/${id}/unban`),
  getBlockedUsers: (userId: string) => api.get(`/user/${userId}/blocked`),
  getUserReports: (userId: string) => api.get(`/user/${userId}/reports`),
};

// Creator approval management
export const creatorApi = {
  getPendingCreators: () => api.get("/admin/creators/pending"),
  approveCreator: (id: string, approved: boolean, notes?: string) =>
    api.post(`/admin/creators/${id}/approve`, { approved, notes }),
};

// Report management
export const reportApi = {
  getAllReports: () => api.get("/reports"),
  getReport: (id: string) => api.get(`/report/${id}`),
  updateReportStatus: (id: string, status: string) =>
    api.put(`/report/${id}`, { status }),
  deleteReport: (id: string) => api.delete(`/report/${id}`),
};

// Analytics
export const analyticsApi = {
  getDashboardStats: () => api.get("/analytics/dashboard"),
  getUserStats: () => api.get("/analytics/users"),
  getReportStats: () => api.get("/analytics/reports"),
};

// Block management
export const blockApi = {
  blockUser: (blockerId: string, blockedId: string) =>
    api.post("/block", { blocker_id: blockerId, blocked_id: blockedId }),
  unblockUser: (blockerId: string, blockedId: string) =>
    api.post("/unblock", { blocker_id: blockerId, blocked_id: blockedId }),
  getBlockStatus: (userId: string, targetUserId: string) =>
    api.get(`/block-status?user_id=${userId}&target_user_id=${targetUserId}`),
};

export default api;
