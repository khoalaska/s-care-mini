import axiosClient from "./axiosClient";

export const getApartments = (params) => {
  return axiosClient.get("/apartments", { params });
};

export const createApartment = (data) => {
  return axiosClient.post("/apartments/create", data);
};

export const updateApartment = (id, data) => {
  return axiosClient.patch(`/apartments/${id}`, data);
};

export const deleteApartment = (id) => {
  return axiosClient.delete(`/apartments/${id}`);
};
