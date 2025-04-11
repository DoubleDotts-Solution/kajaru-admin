import DateRangePicker from "../../../components/ui/daterangepicker";
import Button from "../../../components/common/button";
import { Calendar, Check, Plus } from "lucide-react";
import { Loader2, Pencil, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import Ic_search from "../../../assets/images/Ic_search.svg";
import Ic_excel from "../../../assets/images/Ic_excel.svg";
import Ic_filter from "../../../assets/images/Ic_filter.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "../../../components/common/modal";
import { formatDateToYYYYMMDD, formatTimestamp } from "../../../lib/utils";
import toast from "react-hot-toast";
import Drawer from "../../../components/ui/drawer";
import { ConsignmentForm } from "./consignmentForm";
import {
  useDeleteBoxApiMutation,
  useGetBoxApiQuery,
  useUpdateBoxStatusApiMutation,
} from "../../../store/slice/apiSlice/box";
import {
  useDeleteConsignmentApiMutation,
  useGetSingleConsignmentApiMutation,
} from "../../../store/slice/apiSlice/consignment";

export const ConsignmentDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("unsent");
  const [selectedRows, setSelectedRows] = useState<any>({
    sent: [],
    unsent: [],
  });

  const pathParts = location.pathname.split("/");
  const id = pathParts[pathParts.length - 1];
  const [getSingleConsignment] = useGetSingleConsignmentApiMutation();
  const [consignmentData, setConsignmentData] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response: any = await getSingleConsignment(id).unwrap();

        if (response.status === 200) {
          setConsignmentData(response.data);
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong", {
          position: "top-right",
        });
      }
    };

    fetchData();
  }, [getSingleConsignment, id]);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };
  const handleRowSelection = (rowData: any, isChecked: boolean) => {
    setSelectedRows((prevSelected: any) => {
      const updatedStatus = rowData.status;
      const current = prevSelected[updatedStatus] || [];

      return {
        ...prevSelected,
        [updatedStatus]: isChecked
          ? [...current, rowData]
          : current.filter((item: any) => item.id !== rowData.id),
      };
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const perPage = 10;

  const params = {
    page: currentPage,
    limit: perPage,
    value: searchTerm,
    ...(startDate &&
      endDate && {
        start_date: formatDateToYYYYMMDD(startDate),
        end_date: formatDateToYYYYMMDD(endDate),
      }),
    ...(status && { status: status }),
  };

  const { data, isLoading, refetch } = useGetBoxApiQuery(params);
  const boxData = (data as any) || {
    data: [],
    pagination: {
      totalPages: 1,
      currentPage: 1,
      limit: 10,
      totalCount: 0,
    },
  };

  const box = boxData?.data;

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [selectedBy, setSelectedBy] = useState<any>(null);

  const [deleteBox] = useDeleteBoxApiMutation();
  const [deleteConsignment] = useDeleteConsignmentApiMutation();

  const handleDelete = async (id: string) => {
    try {
      if (selectedBy === "consignment") {
        const response: any = await deleteConsignment(id).unwrap();

        toast.success(response.message, { position: "top-right" });
        navigate("/consignment");
      } else {
        const response: any = await deleteBox(id).unwrap();
        toast.success(response.message, { position: "top-right" });
      }
      setShowConfirm(false);
      setSelectedBy(null);
      refetch();
    } catch (error: any) {
      toast.error(error.data.message, { position: "top-right" });
      setShowConfirm(false);
    }
  };

  const handleConfirmPopup = () => {
    if (showConfirm) {
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setShowConfirm(true);
  };
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "select",
        header: ({ table }: any) => {
          const allSelected = table
            .getRowModel()
            .rows.every((row: any) =>
              selectedRows[row.original.status]?.some(
                (r: any) => r.id === row.original.id
              )
            );

          return (
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => {
                const checked = e.target.checked;
                const updatedSelectedRows = { ...selectedRows };

                table.getRowModel().rows.forEach((row: any) => {
                  const status = row.original.status;
                  const currentRows = updatedSelectedRows[status] || [];

                  if (checked) {
                    const exists = currentRows.some(
                      (r: any) => r.id === row.original.id
                    );
                    if (!exists) {
                      updatedSelectedRows[status] = [
                        ...currentRows,
                        row.original,
                      ];
                    }
                  } else {
                    updatedSelectedRows[status] = currentRows.filter(
                      (r: any) => r.id !== row.original.id
                    );
                  }
                });

                setSelectedRows(updatedSelectedRows);
              }}
              className="w-4 h-4 appearance-none border-2 border-gray rounded-sm
                checked:bg-primary checked:border-purple
                relative
                checked:after:content-['✓'] after:text-white after:text-am after:font-bold
                after:absolute after:top-0 after:left-0 after:w-full after:h-full
                after:flex after:items-center after:justify-center"
            />
          );
        },
        cell: ({ row }: any) => {
          const isSelected = selectedRows[row.original.status]?.some(
            (r: any) => r.id === row.original.id
          );
          return (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                handleRowSelection(row.original, e.target.checked);
              }}
              className="w-4 h-4 appearance-none border-2 border-gray rounded-sm
            checked:bg-primary checked:border-purple
            relative
            checked:after:content-['✓'] after:text-white after:text-am after:font-bold
            after:absolute after:top-0 after:left-0 after:w-full after:h-full
            after:flex after:items-center after:justify-center"
            />
          );
        },
      },
      {
        accessorKey: "Box ID",
        header: "Box ID",
        cell: ({ row }: any) => {
          return (
            <>
              <Link
                to={`/consignment/${row.original.id}`}
                className="text-purple text-sm font-semibold w-max cursor-pointer"
              >
                {row.original.box_id}
              </Link>
            </>
          );
        },
      },
      {
        accessorKey: "Max Box Capacity",
        header: "Max Box Capacity",
        cell: ({ row }: any) => (
          <p className="font-semibold text-sm text-darkBlack w-max">
            {row.original.max_box_capacity}
          </p>
        ),
      },
      {
        accessorKey: "Created On",
        header: "Created On",
        cell: ({ row }: any) => (
          <p className="font-semibold text-sm text-darkBlack w-max">
            {formatTimestamp(row.original.updatedAt)}
          </p>
        ),
      },
      {
        accessorKey: "Product Packed",
        header: "Product Packed",
        cell: ({ row }: any) => (
          <p className="text-sm text-darkBlack w-max">
            {row.original.product_packed}
          </p>
        ),
      },
      {
        accessorKey: "Product Unpacked",
        header: "Product Unpacked",
        cell: ({ row }: any) => (
          <p className="text-sm text-darkBlack w-max">
            {row.original.max_box_capacity - row.original.product_packed}
          </p>
        ),
      },
      {
        accessorKey: "Status",
        header: "Status",
        cell: ({ row }: any) => (
          <div>
            {row.original.status === "unsent" ? (
              <p className="text-sm bg-lightRed text-darkRed py-[2px] px-[10px] font-medium rounded-[16px] w-max">
                Unsent
              </p>
            ) : (
              <p className="text-sm bg-lightGreen text-darkGreen py-[2px] px-[10px] font-medium rounded-[16px] w-max">
                Sent
              </p>
            )}
          </div>
        ),
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }: any) => (
          <>
            <div className="flex items-center justify-center gap-3">
              <Pencil
                className="h-5 w-5 text-primary cursor-pointer"
                onClick={() => {
                  navigate(`?edit-consignment=${row.original.id}`);
                  setDrawerOpen(true);
                }}
              />

              <Trash
                className="h-5 w-5 text-primary cursor-pointer"
                onClick={() => confirmDelete(row.original.id)}
              />
            </div>
          </>
        ),
      },
    ],
    [navigate, selectedRows]
  );
  const pagination = boxData?.pagination;

  const table = useReactTable({
    data: box,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pagination?.limit,
      },
    },
    pageCount: Math.ceil(box?.length / pagination?.limit),
    manualPagination: true,
    onPaginationChange: (updater: any) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: currentPage - 1,
          perPage: pagination?.limit,
        });
        setCurrentPage(newState.pageIndex + 1);
      }
    },
  });

  const [updateStatus] = useUpdateBoxStatusApiMutation();
  const handleUpdateStatus = async (ids: string, status: string) => {
    try {
      const payload = {
        box_id: ids,
        status: status,
      };

      const response: any = await updateStatus(payload).unwrap();
      toast.success(response.message, { position: "top-right" });
      refetch();
    } catch (error: any) {
      toast.error(error.data.message, { position: "top-right" });
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("add-consignment") || params.has("edit-consignment")) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  }, [location.search]);

  // const openDrawer = () => {
  //   setDrawerOpen(true);
  //   navigate("?add-box");
  // };
  const closeDrawer = () => {
    setDrawerOpen(false);
    navigate(`/consignment-details/${id}`);
  };
  return (
    <>
      <div className="py-6 md:py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 md:mb-8">
          <h2 className="text-darkBlack text-xl md:text-2xl lg:text-[28px] desktop:text-[32px] font-medium">
            Consignment Details
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 md:h-[40px] md:items-center">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
            />
            <Button
              text={"Scan Box"}
              className={`bg-purple shadow-shadow2 text-white`}
              icon={<Plus className="text-white w-5 h-5" />}
              // onClick={openDrawer}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray2 shadow-shadow1 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray2">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-darkBlack text-2xl font-medium">
                {consignmentData?.consignment_number}
              </h2>
              {consignmentData?.status === "unsent" ? (
                <p className="text-sm bg-lightRed text-darkRed py-[2px] px-[10px] font-medium rounded-[16px] w-max">
                  Unsent
                </p>
              ) : (
                <p className="text-sm bg-lightGreen text-darkGreen py-[2px] px-[10px] font-medium rounded-[16px] w-max">
                  Sent
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <p className="text-gray font-medium tex-base">
                    No. of Boxes:
                  </p>
                  <span className="text-darkBlack font-medium text-base">
                    {consignmentData?.number_of_box}
                  </span>
                </div>
                <div className="border-l border-[#D1D4DA] h-[14px]"></div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-darkBlack w-5 h-5" />
                  <span className="text-darkBlack font-medium text-base">
                    {formatTimestamp(consignmentData?.updatedAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-max">
                <img src={Ic_excel} alt="excel_icon" />
                <p className="text-sm font-medium text-darkBlack">
                  Consignment.exls
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 flex items-center gap-2 justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray text-base font-medium">Tags:</span>
              <div className="flex flex-wrap gap-2 w-max">
                {consignmentData?.tags
                  .split(",")
                  .map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-gray6 text-sm text-black3 px-3 py-0.5 rounded-full"
                    >
                      #{tag.trim().replace(/^'+|'+$/g, "")}
                    </span>
                  ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Pencil
                className="h-5 w-5 text-primary cursor-pointer"
                onClick={() => {
                  navigate(
                    `/consignment?edit-consignment=${consignmentData?.id}`
                  );
                  setDrawerOpen(true);
                }}
              />

              <Trash
                className="h-5 w-5 text-red cursor-pointer"
                onClick={() => {
                  confirmDelete(consignmentData?.id);
                  setSelectedBy("consignment");
                }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray2 shadow-shadow1 overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-2">
            <div className="flex border border-gray rounded-lg h-[40px] overflow-hidden">
              <div
                className={`px-4 flex items-center h-full justify-center border-r border-gray cursor-pointer ${
                  status === "unsent" ? "text-purple bg-gray5" : "text-black"
                }`}
                onClick={() => {
                  setStatus("unsent");
                  refetch();
                }}
              >
                Unsent
              </div>
              <div
                className={`px-4 flex items-center h-full justify-center cursor-pointer ${
                  status === "sent" ? "text-purple bg-gray5" : "text-black"
                }`}
                onClick={() => {
                  setStatus("sent");
                  refetch();
                }}
              >
                Sent
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 desktop:gap-4">
              {selectedRows &&
                ((selectedRows.sent.length > 0 && status === "sent") ||
                (selectedRows.unsent.length > 0 && status === "unsent") ? (
                  <div className="flex items-center gap-2 md:gap-4">
                    <div
                      className="border border-gray rounded-lg flex items-center gap-2 py-[10px] px-4 h-[40px] cursor-pointer"
                      onClick={() => {
                        const isSent = status === "sent";
                        const rows = isSent
                          ? selectedRows.sent
                          : selectedRows.unsent;
                        const idsString = rows
                          .map((item: any) => item.id)
                          .join(",");
                        handleUpdateStatus(
                          idsString,
                          isSent ? "unsent" : "sent"
                        );
                      }}
                    >
                      <Check
                        className={`h-5 w-5 ${
                          status === "sent" ? "text-red" : "text-darkParrot"
                        }`}
                      />
                      <span className="text-black text-sm whitespace-nowrap font-medium">
                        {status === "sent"
                          ? "Mark as a Unsent"
                          : "Mark as a Sent"}
                      </span>
                    </div>
                    <div className="border-l border-gray2 h-[20px] hidden md:block"></div>
                  </div>
                ) : null)}

              <div className="flex items-center border border-gray shadow-shadow2 bg-[#fff] gap-2 rounded-lg py-[10px] px-[14px] h-[40px]">
                <img src={Ic_search} alt="search" />
                <input
                  type="text"
                  placeholder="Search"
                  className="focus-within:outline-none w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3 items-center">
                <div className="border border-gray rounded-[8px] flex gap-2 items-center py-[10px] px-4 cursor-pointer shadow-shadow2 h-[40px] bg-[#fff]">
                  <img src={Ic_filter} alt="" />
                  <span className="text-black font-medium text-sm">
                    filters
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              {table?.getHeaderGroups().map((headerGroup: any) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header: any) => (
                    <TableHead key={header.id} className="h-8 text-sm">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : box?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns?.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel()?.rows?.length &&
                table.getRowModel()?.rows.map((row: any) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 md:px-6 py-1.5 md:py-3"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-6 border-t border-gray2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-[14px] py-2 rounded-lg disabled:opacity-50 shadow-shadow1 border border-gray text-black font-semibold text-sm"
            >
              Forrige
            </button>
            <span className="text-black text-sm">
              Side <span className="font-semibold">{currentPage}</span> av{" "}
              <span className="font-semibold">{pagination?.totalPages}</span>
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination?.totalPages)
                )
              }
              disabled={currentPage === pagination?.totalPages}
              className="px-[14px] py-2 rounded-lg disabled:opacity-50 shadow-shadow1 border border-gray text-black font-semibold text-sm"
            >
              Neste
            </button>
          </div>
        </div>

        {showConfirm && (
          <Modal onClose={handleConfirmPopup} isOpen={true}>
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg font-bold">
                  Are you sure you want to delete?
                </p>
                <div className="flex justify-center mt-5 w-full gap-5 items-center">
                  <div onClick={() => setShowConfirm(false)}>
                    <Button
                      text="Cancel"
                      className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                    />
                  </div>
                  <div onClick={() => handleDelete(selectedId)}>
                    <Button
                      text="Confirm"
                      className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {isDrawerOpen && (
          <Drawer onClose={closeDrawer}>
            <ConsignmentForm refetch={refetch} closeDrawer={closeDrawer} />
          </Drawer>
        )}
      </div>
    </>
  );
};
