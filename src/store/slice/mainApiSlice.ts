import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config/constant";

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("__kajaru_access_");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("__kajaru_refresh_");

    try {
      const refreshResult = await fetch(`${BASE_URL}admin/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("__kajaru_refresh_")}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      const refreshData = await refreshResult.json();

      if (refreshResult.ok && refreshData?.accessToken) {
        sessionStorage.setItem("__kajaru_access_", refreshData.accessToken);
        localStorage.setItem("__kajaru_refresh_", refreshData.refreshToken);

        const retryResult = await rawBaseQuery(args, api, extraOptions);
        return retryResult;
      } else {
        console.error("Refresh token failed");
      }
    } catch (e) {
      console.error("Refresh token error:", e);
    }
  }

  return result;
};

export const mainApi = createApi({
  reducerPath: "mainApi",
  // baseQuery: fetchBaseQuery({
  //   baseUrl: BASE_URL,
  //   prepareHeaders: (headers) => {
  //     const token = sessionStorage.getItem("__kajaru_access_");

  //     if (token) {
  //       headers.set("Authorization", `Bearer ${token}`);
  //     }

  //     return headers;
  //   },
  // }),
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Main"],
  keepUnusedDataFor: 0,
  endpoints: () => ({}),
});
