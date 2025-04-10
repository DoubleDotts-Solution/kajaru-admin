/* eslint-disable react-hooks/rules-of-hooks */
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
import Ic_excel from "../../../assets/images/Ic_excel.svg";
import Ic_upload_photo from "../../../assets/images/Ic_upload_photo.svg";
import { Input } from "../../../components/ui/input";
import { z } from "zod";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import {
  useAddConsignmentApiMutation,
  useGetSingleConsignmentApiMutation,
  useUpdateConsignmentApiMutation,
} from "../../../store/slice/apiSlice/consignment";
import { useLocation } from "react-router-dom";
import { Trash2, X } from "lucide-react";

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
  const [getSingleConsignment] = useGetSingleConsignmentApiMutation();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response: any = await getSingleConsignment(id).unwrap();

        if (response.status === 200) {
          const { consignment_number, number_of_box, tags, attachment } =
            response.data;

          const valuesToSet = {
            consignment_number,
            number_of_box,
            tags,
            attachment,
          };

          Object.entries(valuesToSet).forEach(([key, value]) => {
            form.setValue(key as keyof typeof valuesToSet, value);
          });
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong", {
          position: "top-right",
        });
      }
    };

    fetchData();
  }, [getSingleConsignment, id, form]);

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
  const [updateConsignment] = useUpdateConsignmentApiMutation();

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
      if (id) {
        const response: any = await updateConsignment({
          id: Number(id),
          data: formData,
        }).unwrap();
        toast.success(response.message, { position: "top-right" });
      } else {
        const response: any = await addConsignment(formData).unwrap();
        toast.success(response.message, { position: "top-right" });
      }
      refetch();
      closeDrawer();
    } catch (error: any) {
      toast.error(error.data.message, { position: "top-right" });
    }
  };

  return (
    <>
      <div className="bg-gray2 p-4 lg:p-6 border-b border-gray2">
        <h5 className="text-darkBlack text-base md:text-xl desktop:text-2xl font-medium">
          {id ? "Update Consignment" : "Create Consignment"}
        </h5>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div className="p-5 laptop:p-6 overflow-y-auto h-[calc(100vh-57px)] md:h-[calc(100vh-61px)] lg:h-[calc(100vh-160px)]">
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
                  render={({ field, fieldState }) => {
                    const [tagInput, setTagInput] = useState("");
                    const [tagsList, setTagsList] = useState<string[]>([]);

                    useEffect(() => {
                      if (field.value) {
                        setTagsList(
                          field.value
                            .split(",")
                            .map((tag: string) =>
                              tag.trim().replace(/^'+|'+$/g, "")
                            )
                        );
                      }
                    }, [field.value]);

                    const handleAddTag = () => {
                      const trimmed = tagInput.trim();
                      if (trimmed && !tagsList.includes(trimmed)) {
                        const updatedTags = [...tagsList, trimmed];
                        setTagsList(updatedTags);
                        field.onChange(
                          updatedTags.map((tag) => `'${tag}'`).join(",")
                        );
                        setTagInput("");
                      }
                    };

                    return (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm font-medium`}
                        >
                          Tags*
                        </p>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Add Tags"
                              value={tagInput}
                              onChange={(e: any) => setTagInput(e.target.value)}
                              className={`bg-white rounded-[8px] border text-black ${
                                fieldState?.error ? "border-red" : "border-gray"
                              }`}
                              type="text"
                            />
                            <button
                              type="button"
                              onClick={handleAddTag}
                              className="bg-primary text-white px-4 py-2 h-[44px] rounded-[8px] text-sm"
                            >
                              Add
                            </button>
                          </div>
                        </FormControl>
                        {tagsList && tagsList.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {tagsList.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-lightPurple px-2 py-1 rounded-lg text-sm text-darkBlack flex items-center gap-2"
                              >
                                {tag}

                                <X
                                  className="w-4 h-4 text-primary"
                                  onClick={() => {
                                    const updatedTags = tagsList.filter(
                                      (_, i) => i !== index
                                    );
                                    setTagsList(updatedTags);
                                    field.onChange(
                                      updatedTags
                                        .map((tag) => `'${tag}'`)
                                        .join(",")
                                    );
                                  }}
                                />
                              </span>
                            ))}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex gap-6 items-center">
                <FormField
                  control={form.control}
                  name="attachment"
                  render={({ fieldState, field }) => (
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
                          {field.value && (
                            <>
                              <div className="flex mt-3 justify-between gap-2 items-center border border-gray2 rounded-lg py-3 px-4">
                                <div className="flex items-center gap-2 w-max">
                                  <img src={Ic_excel} alt="excel_icon" />
                                  <p className="text-sm font-medium text-darkBlack">
                                    Consignment.exls
                                  </p>
                                </div>
                                <Trash2
                                  className="text-red w-5 h-5 cursor-pointer"
                                  onClick={() => form.resetField("attachment")}
                                />
                              </div>
                            </>
                          )}
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
                text={id ? "Update Consignment" : "Create Consignment"}
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
