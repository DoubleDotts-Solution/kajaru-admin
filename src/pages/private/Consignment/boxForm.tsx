/* eslint-disable react-hooks/rules-of-hooks */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../../components/ui/form";
import Button from "../../../components/common/button";
import { z } from "zod";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  useAddConsignmentApiMutation,
  useUpdateConsignmentApiMutation,
} from "../../../store/slice/apiSlice/consignment";
import { useLocation } from "react-router-dom";
import { useGetSingleBoxApiMutation } from "../../../store/slice/apiSlice/box";

const formSchema = z.object({
  consignment_number: z.string().min(2, {
    message: "Consignment number must contain at least 2 characters.",
  }),
});

export const BoxForm = ({
  refetch,
  closeDrawer,
}: {
  refetch: any;
  closeDrawer: any;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const id = searchParams.get("edit-box-detail");
  const [getSingleConsignment] = useGetSingleBoxApiMutation();
  const [boxData, setBoxData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response: any = await getSingleConsignment(id).unwrap();
        if (response.status === 200) {
          setBoxData(response.data);
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong", {
          position: "top-right",
        });
      }
    };

    fetchData();
  }, [getSingleConsignment, id]);

  const [addConsignment] = useAddConsignmentApiMutation();
  const [updateConsignment] = useUpdateConsignmentApiMutation();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (id) {
        const response: any = await updateConsignment({
          id: Number(id),
          data: data,
        }).unwrap();
        toast.success(response.message, { position: "top-right" });
      } else {
        const response: any = await addConsignment(data).unwrap();
        toast.success(response.message, { position: "top-right" });
      }
      refetch();
      closeDrawer();
    } catch (error: any) {
      toast.error(error.data.message, { position: "top-right" });
    }
  };
  console.log(boxData);

  return (
    <>
      <div className="bg-gray5 p-4 lg:p-6 border-b border-gray2">
        <h5 className="text-darkBlack text-base md:text-xl desktop:text-2xl font-medium">
          Box ID: {id}
        </h5>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div className="overflow-y-auto h-[calc(100vh-57px)] md:h-[calc(100vh-61px)] lg:h-[calc(100vh-160px)]">
            <div className="p-5 laptop:p-6 border-b border-gray2">
              <div
                className="border border-gray2 rounded-lg p-4 flex justify-between gap-3"
                style={{
                  boxShadow:
                    "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
                }}
              >
                <div className="flex flex-col gap-2">
                  <p className="text-gray font-medium text-sm">Box Capacity</p>
                  <h4 className="text-xl text-darkBlack font-semibold">
                    {boxData?.max_box_capacity}
                  </h4>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray font-medium text-sm">
                    Product Packed
                  </p>
                  <h4 className="text-xl text-darkBlack font-semibold">
                    {boxData?.product_packed}
                  </h4>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray font-medium text-sm">
                    Product Unpacked
                  </p>
                  <h4 className="text-xl text-darkBlack font-semibold">
                    {boxData?.max_box_capacity - boxData?.product_packed}
                  </h4>
                </div>
              </div>
            </div>
            <div>
              {/* <div>
                <FormField
                  control={form.control}
                  name="consignment_number"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <p
                        className={`${
                          fieldState.error ? "text-red" : "text-black"
                        } mb-[6px] text-sm font-medium`}
                      >
                        Consignment Number*
                      </p>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter Consignment Number"
                            {...field}
                            className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray"
                                          } `}
                            type="text"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}
              <div></div>
            </div>
          </div>
          <div className="flex justify-end w-full gap-4 items-center sticky bottom-0 bg-white z-50 py-3 px-6">
            <div onClick={() => form.reset()} className="w-1/2">
              <Button
                text="Cancel"
                className="border-2 border-purple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2 w-full"
              />
            </div>
            <div className="w-1/2">
              <Button
                text="Scan FSN"
                className="border-2 border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2 w-full"
                type="submit"
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
