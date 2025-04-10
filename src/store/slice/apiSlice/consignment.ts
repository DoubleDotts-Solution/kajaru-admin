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

const consignmentApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getConsignmentApi: builder.query<unknown, filterApiParams>({
      query: (data: filterApiParams) => ({
        url: `consignment`,
        method: "POST",
        body: data,
      }),
    }),
    updateConsignmentStatusApi: builder.mutation<unknown, any>({
      query: (data: any) => ({
        url: `consignment/update-status`,
        method: "PATCH",
        body: data,
      }),
    }),
    addConsignmentApi: builder.mutation<unknown, any>({
      query: (data: any) => ({
        url: `consignment/create`,
        method: "POST",
        body: data,
      }),
    }),
    deleteConsignmentApi: builder.mutation<unknown, any>({
      query: (id: any) => ({
        url: `consignment/delete/${id}`,
        method: "DELETE",
      }),
    }),
    getSingleConsignmentApi: builder.mutation<unknown, any>({
      query: (id: any) => ({
        url: `consignment/find/${id}`,
        method: "GET",
      }),
    }),
    updateConsignmentApi: builder.mutation<unknown, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `consignment/update/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetConsignmentApiQuery,
  useUpdateConsignmentStatusApiMutation,
  useAddConsignmentApiMutation,
  useDeleteConsignmentApiMutation,
  useGetSingleConsignmentApiMutation,
  useUpdateConsignmentApiMutation,
} = consignmentApi;
