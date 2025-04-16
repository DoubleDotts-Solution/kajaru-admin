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
  }),
});

export const { useDeleteProductApiMutation, useAddProductApiMutation } =
  productApi;
