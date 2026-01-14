import axios from "axios";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const api = axios.create({
  baseURL: "https://admin.jeevanshaili.com/api",
});

api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    // prevent 304 cache bug on mobile
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    console.log("api request config------", config.headers.Authorization);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
