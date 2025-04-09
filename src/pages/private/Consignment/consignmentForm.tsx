import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import Button from "../../../components/common/button";
import Ic_upload_photo from "../../../assets/images/Ic_upload_photo.svg";
import { Input } from "../../../components/ui/input";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useAddConsignmentApiMutation } from "../../../store/slice/apiSlice/consignment";
import { useLocation } from "react-router-dom";

const formSchema = z.object({
  consignment_number: z.string().min(2, {
    message: "Consignment number must contain at least 2 characters.",
  }),
  number_of_box: z.number().min(1, {
    message: "Number of boxes must be at least 1.",
  }),
  tags: z.string().min(2, {
    message: "Tags must contain at least 2 characters.",
  }),
  attachment: z.union([
    z
      .instanceof(File)
      .refine((file: any) => file === null || file.size <= 10 * 1024 * 1024, {
        message: "The file size must be less than 10 MB.",
      }),
    z.string(),
  ]),
});

export const ConsignmentForm = ({
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
  const id = searchParams.get("edit-consignment");
  console.log(id);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      form.setValue("attachment", files[0]);
    }
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      form.setValue("attachment", files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const [addConsignment] = useAddConsignmentApiMutation();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof FileList) {
          Array.from(value).forEach((file) => {
            formData.append(key, file);
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });
      const response: any = await addConsignment(formData).unwrap();
      toast.success(response.message, { position: "top-right" });
      refetch();
      closeDrawer();
    } catch (error: any) {
      toast.error(error.data.message, { position: "top-right" });
    }
  };
  return (
    <>
      <div className="bg-gray2 p-6 border-b border-gray2">
        <h5 className="text-darkBlack text-2xl font-medium">
          Create Consignment
        </h5>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div className="p-5 laptop:p-6 overflow-y-auto h-[calc(100vh-160px)]">
            <div className="flex flex-col gap-6">
              <div>
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
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="number_of_box"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <p
                        className={`${
                          fieldState.error ? "text-red" : "text-black"
                        } mb-[6px] text-sm font-medium`}
                      >
                        Number of Box*
                      </p>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter Number of Box"
                            {...field}
                            className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray"
                                          } `}
                            type="number"
                            onChange={(e: any) =>
                              field.onChange(Number(e.target.value) || "")
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <p
                        className={`${
                          fieldState.error ? "text-red" : "text-black"
                        } mb-[6px] text-sm font-medium`}
                      >
                        Tags*
                      </p>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Add Tags"
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
              </div>
              <div className="flex gap-6 items-center">
                <FormField
                  control={form.control}
                  name="attachment"
                  render={({ fieldState }) => (
                    <FormItem className="w-full">
                      <p
                        className={`${
                          fieldState.error ? "text-red" : "text-black"
                        } mb-[6px] text-sm font-medium`}
                      >
                        Upload Consignment file*
                      </p>
                      <FormControl>
                        <div className="relative w-full">
                          <div
                            className="border border-gray2 rounded-[8px] px-3 laptop:px-6 py-4 flex justify-center items-center flex-col gap-3 cursor-pointer w-full"
                            onDragOver={handleDragOver}
                            onClick={handleClick}
                            onDrop={handleDrop}
                          >
                            <img src={Ic_upload_photo} alt="upload" />
                            <p className="text-gray text-sm text-center truncate w-full">
                              <span className="text-primary font-medium truncate">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-gray text-sm text-center truncate w-full">
                              Xls or CSV (max. 10 Mb)
                            </p>
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept=".csv, application/vnd.ms-excel"
                              onChange={handleFileChange}
                              name="photo"
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                text="Create Consignment"
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
