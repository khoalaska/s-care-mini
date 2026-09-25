import axiosClient from "./axiosClient";

export const getRequests = (params) => {
  return axiosClient.get("/requests", { params });
};

export const getRequestById = (id) => {
  return axiosClient.get(`/requests/${id}`);
};

export const createRequest = (data) => {
  return axiosClient.post("/requests/create", data);
};

export const uploadImages = (requestId, formData) => {
  return axiosClient.post(`/requests/${requestId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateStatus = (requestId, newStatus, note = "") => {
  return axiosClient.patch(`/requests/${requestId}/status`, { newStatus, note });
};

export const assignRequest = (requestId, technicianId) => {
  return axiosClient.patch(`/requests/${requestId}/assign`, { technicianId });
};
