/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainApi } from "../mainApiSlice";

interface BlogFilterApiParams {
  page?: number;
  limit?: number;
  value?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

const consignmentApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getConsignmentApi: builder.query<unknown, BlogFilterApiParams>({
      query: (data: BlogFilterApiParams) => ({
        url: `consignment`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetConsignmentApiQuery } = consignmentApi;
