import axios, { AxiosResponse } from "axios";

export const apiUrl = process.env.REACT_BASE_URL_API;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (sessionStorage.getItem("__kajaru_access_")) {
    config.headers.Authorization = `Bearer ${sessionStorage.getItem(
      "__kajaru_access_"
    )}`;
  }
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest.isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        const { data } = await axios.post(
          `${apiUrl}admin/refresh-token`,
          {
            refresh_token: localStorage.getItem("__kajaru_refresh_"),
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem(
                "__kajaru_access_"
              )}`,
            },
          }
        );

        sessionStorage.setItem("__kajaru_access_", data.accessToken);
        localStorage.setItem("__kajaru_refresh_", data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api.request(originalRequest);
      } catch (err) {
        console.error(err);
      }
    }
    throw error;
  }
);

export default api;

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AxiosResponse> => {
  return api.post("/auth/login", data);
};

export const logout = async (): Promise<AxiosResponse> => {
  return api.get("/auth/logout");
};

export const init = async (): Promise<AxiosResponse> => {
  return api.get("/users/init");
};
