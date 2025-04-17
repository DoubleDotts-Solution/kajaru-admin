/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainApi } from "../mainApiSlice";

const productApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteProductApi: builder.mutation<unknown, any>({
      query: (id: any) => ({
        url: `product/delete/${id}`,
        method: "DELETE",
      }),
    }),
    addProductApi: builder.mutation<unknown, any>({
      query: (data: any) => ({
        url: `product/create`,
        method: "POST",
        body: data,
      }),
    }),
    editProductApi: builder.mutation<unknown, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `product/update/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useDeleteProductApiMutation,
  useAddProductApiMutation,
  useEditProductApiMutation,
} = productApi;
