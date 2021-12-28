import axios from "axios";
import store from "../store";

const API_URL = process.env.VUE_APP_API_URL;

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = store.getters["accessToken"];
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "/auth/login" && err.response) {
      // access token expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const refreshToken = store.getters["refreshToken"];
          const rs = await instance.post("/auth/refresh", {
            token: refreshToken,
          });
          const { accessToken } = rs.data;
          store.dispatch("refresh", accessToken);
          return instance(originalConfig);
        } catch (_error) {
          await store.dispatch("logout");
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
