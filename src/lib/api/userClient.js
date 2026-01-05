import axios from "axios";

export const updatePassword = async (data) =>
  axios.patch("/api/user/password", data, {
      withCredentials: true,
      headers: {
          "Content-Type": "application/json"
      }
  });


