import axios from "axios";

const defaultApi = import.meta.env.VITE_API_URL || "http://localhost:5000/";
const normalizeBase = (url) => (url.endsWith("/") ? url : url + "/");

const baseURL = normalizeBase(defaultApi);

const $host = axios.create({
  baseURL,
});

const $authHost = axios.create({
  baseURL,
});

const authInterceptor = (config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) config.headers.authorization = `Bearer ${token}`;
  } catch (e) {
    // ignore localStorage errors
  }
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
