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

const deliveryApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryApi: builder.query<unknown, filterApiParams>({
      query: (data: filterApiParams) => ({
        url: `delivery`,
        method: "POST",
        body: data,
      }),
    }),
    updateDeliveryStatusApi: builder.mutation<unknown, any>({
      query: (data: any) => ({
        url: `delivery/update-status`,
        method: "PATCH",
        body: data,
      }),
    }),
    addDeliveryApi: builder.mutation<unknown, any>({
      query: (data: any) => ({
        url: `delivery/create`,
        method: "POST",
        body: data,
      }),
    }),
    deleteDeliveryApi: builder.mutation<unknown, any>({
      query: (id: any) => ({
        url: `delivery/delete/${id}`,
        method: "DELETE",
      }),
    }),
    getSingleDeliveryApi: builder.mutation<unknown, any>({
      query: (id: any) => ({
        url: `delivery/find/${id}`,
        method: "GET",
      }),
    }),
    updateDeliveryApi: builder.mutation<unknown, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `delivery/update/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetDeliveryApiQuery,
  useUpdateDeliveryStatusApiMutation,
  useAddDeliveryApiMutation,
  useDeleteDeliveryApiMutation,
  useGetSingleDeliveryApiMutation,
  useUpdateDeliveryApiMutation,
} = deliveryApi;
