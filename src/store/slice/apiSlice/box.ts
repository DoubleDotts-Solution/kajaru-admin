/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainApi } from "../mainApiSlice";

interface filterApiParams {
  page?: number;
  limit?: number;
  value?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

const boxApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getBoxApi: builder.query<unknown, filterApiParams>({
      query: (data: filterApiParams) => ({
        url: `box`,
        method: "POST",
        body: data,
      }),
    }),
    updateBoxStatusApi: builder.mutation<unknown, any>({
      query: (data: any) => ({
        url: `box/update-status`,
        method: "PATCH",
        body: data,
      }),
    }),
    addBoxApi: builder.mutation<unknown, any>({
      query: (data: any) => ({
        url: `box/create`,
        method: "POST",
        body: data,
      }),
    }),
    deleteBoxApi: builder.mutation<unknown, any>({
      query: (id: any) => ({
        url: `box/delete/${id}`,
        method: "DELETE",
      }),
    }),
    getSingleBoxApi: builder.mutation<unknown, any>({
      query: (id: any) => ({
        url: `box/find/${id}`,
        method: "GET",
      }),
    }),
    updateBoxApi: builder.mutation<unknown, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `box/update/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetBoxApiQuery,
  useUpdateBoxStatusApiMutation,
  useAddBoxApiMutation,
  useDeleteBoxApiMutation,
  useGetSingleBoxApiMutation,
  useUpdateBoxApiMutation,
} = boxApi;
