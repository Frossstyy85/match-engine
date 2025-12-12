import axios from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8080/api/",
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => {
    const envelope = response.data || {};
    return {
      data: envelope.data,
      message: envelope.message,
      status: response.status,
      raw: response,
    };
  },
  (error) => {
    const resp = error.response;
    const envelope = resp?.data || {};
    return Promise.reject({
      status: resp?.status,
      message: envelope.message || error.message || "Request failed",
      data: envelope.data,
      raw: resp,
    });
  }
);

export default http;
