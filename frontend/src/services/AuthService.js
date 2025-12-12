import http from "./http";

const AuthService = {
  async login(email, password) {
    const res = await http.post("/auth/login", { email, password });
    return res.data; // user object
  },

  async register(name, email, password) {
    const res = await http.post("/auth/register", { name, email, password });
    return { message: res.message };
  },

  async session() {
    const res = await http.get("/auth/session");
    return res.data; // user or null
  },

  async logout() {
    await http.post("/auth/logout");
  },

  async updateProfile(partial) {
    const res = await http.patch("/user/update", partial);
    return res.data; // updated user
  },
};

export default AuthService;
