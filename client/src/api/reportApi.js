import axiosClient from "./axiosClient";

export const getRequestReport = (from, to) => {
  return axiosClient.get("/reports/requests", { params: { from, to } });
};
