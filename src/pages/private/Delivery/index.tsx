import DateRangePicker from "../../../components/ui/daterangepicker";
import Button from "../../../components/common/button";
import { ArrowUp, Check, Plus, ScanLine, X } from "lucide-react";
import { Loader2 } from "lucide-react";
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
import { useMemo, useState } from "react";
import Ic_search from "../../../assets/images/Ic_search.svg";
import Ic_filter from "../../../assets/images/Ic_filter.svg";
import { formatDateToYYYYMMDD, formatTimestamp } from "../../../lib/utils";
import toast from "react-hot-toast";
import {
  useGetDeliveryApiQuery,
  useUpdateDeliveryStatusApiMutation,
} from "../../../store/slice/apiSlice/delivery";
import Modal from "../../../components/common/modal";

export const Delivery = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("delivered");
  const [platForm, setPlatForm] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<any>({
    delivered: [],
    returned: [],
  });

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

  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmPopup = () => {
    if (showConfirm) {
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
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
    ...(platForm && { delivery_platform: platForm }),
  };

  const { data, isLoading, refetch } = useGetDeliveryApiQuery(params);
  const deliveryData = (data as any) || {
    data: [],
    pagination: { totalCount: 0, currentPage: 1, limit: 10, totalPages: 1 },
    platformCounts: { meesho: 0, flipkart: 0, myntra: 0, ajio: 0 },
    platformPercentage: { meesho: 0, flipkart: 0, myntra: 0, ajio: 0 },
  };

  const delivery = deliveryData?.data;

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
        accessorKey: "AWS Number No.",
        header: "AWS Number No.",
        cell: ({ row }: any) => {
          return (
            <>
              <div className="text-purple text-sm font-semibold w-max">
                {row.original.consignment?.consignment_number}
              </div>
            </>
          );
        },
      },
      {
        accessorKey: "Date",
        header: "Date",
        cell: ({ row }: any) => (
          <p className="font-semibold text-sm text-darkBlack w-max">
            {formatTimestamp(row.original.updatedAt)}
          </p>
        ),
      },
      {
        accessorKey: "Status",
        header: "Status",
        cell: ({ row }: any) => (
          <div>
            {row.original.status === "returned" ? (
              <p className="text-sm bg-lightRed text-darkRed py-[2px] px-[10px] font-medium rounded-[16px] w-max">
                Returned
              </p>
            ) : row.original.status === "delivered" ? (
              <p className="text-sm bg-lightGreen text-darkGreen py-[2px] px-[10px] font-medium rounded-[16px] w-max">
                Delivered
              </p>
            ) : (
              <p className="text-sm bg-lightRed text-darkRed py-[2px] px-[10px] font-medium rounded-[16px] w-max">
                Undelivered
              </p>
            )}
          </div>
        ),
      },
    ],
    [selectedRows]
  );
  const pagination = deliveryData?.pagination;

  const table = useReactTable({
    data: delivery,
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
    pageCount: Math.ceil(delivery?.length / pagination?.limit),
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

  const [updateStatus] = useUpdateDeliveryStatusApiMutation();
  const handleUpdateStatus = async (ids: string, status: string) => {
    try {
      const payload = {
        consignment_id: ids,
        status: status,
      };

      const response: any = await updateStatus(payload).unwrap();
      toast.success(response.message, { position: "top-right" });
      refetch();
    } catch (error: any) {
      toast.error(error.data.message, { position: "top-right" });
    }
  };

  return (
    <>
      <div className="py-6 md:py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 md:mb-8">
          <h2 className="text-darkBlack text-xl md:text-2xl lg:text-[28px] desktop:text-[32px] font-medium">
            Delivery
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 md:h-[40px] md:items-center">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
            />
            <Button
              text={"Add Delivery"}
              className={`bg-purple shadow-shadow2 text-white`}
              icon={<Plus className="text-white w-5 h-5" />}
              onClick={() => setShowConfirm(true)}
            />
            <Button
              text={"Add Return"}
              className={`border-2 border-purple shadow-shadow2 text-purple`}
              icon={<Plus className="text-purple w-5 h-5" />}
              onClick={() => setShowConfirm(true)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 desktop:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-4 md:mb-6">
          <div className="shadow-shadow3 border border-gray2 rounded-lg p-4 md:p-5 lg:p-6">
            <div className="flex items-center gap-2 justify-between mb-2">
              <p className="text-gray text-sm font-medium">Myntra</p>
            </div>
            <div className="gap-4 flex items-center justify-between">
              <h3 className="text-darkBlack text-xl md:text-2xl lg:text-[30px] font-semibold">
                {deliveryData?.platformCounts?.myntra}
              </h3>
              <div className="bg-lightGreen rounded-[16px] flex items-center gap-1 py-[2px] px-2 h-6">
                <ArrowUp className="w-3 h-3 text-darkParrot" />
                <p className="text-darkGreen text-xs font-medium">
                  <span className="text-sm">
                    {deliveryData?.platformPercentage?.myntra}%
                  </span>{" "}
                  From Last month
                </p>
              </div>
            </div>
          </div>
          <div className="shadow-shadow3 border border-gray2 rounded-lg p-4 md:p-5 lg:p-6">
            <div className="flex items-center gap-2 justify-between mb-2">
              <p className="text-gray text-sm font-medium">Meesho</p>
            </div>
            <div className="gap-4 flex items-center justify-between">
              <h3 className="text-darkBlack text-xl md:text-2xl lg:text-[30px] font-semibold">
                {deliveryData?.platformCounts?.meesho}
              </h3>
              <div className="bg-lightGreen rounded-[16px] flex items-center gap-1 py-[2px] px-2 h-6">
                <ArrowUp className="w-3 h-3 text-darkParrot" />
                <p className="text-darkGreen text-xs font-medium">
                  <span className="text-sm">
                    {deliveryData?.platformPercentage?.meesho}%
                  </span>{" "}
                  From Last month
                </p>
              </div>
            </div>
          </div>
          <div className="shadow-shadow3 border border-gray2 rounded-lg p-4 md:p-5 lg:p-6">
            <div className="flex items-center gap-2 justify-between mb-2">
              <p className="text-gray text-sm font-medium">Flipkart</p>
            </div>
            <div className="gap-4 flex items-center justify-between">
              <h3 className="text-darkBlack text-xl md:text-2xl lg:text-[30px] font-semibold">
                {deliveryData?.platformCounts?.flipkart}
              </h3>
              <div className="bg-lightGreen rounded-[16px] flex items-center gap-1 py-[2px] px-2 h-6">
                <ArrowUp className="w-3 h-3 text-darkParrot" />
                <p className="text-darkGreen text-xs font-medium">
                  <span className="text-sm">
                    {deliveryData?.platformPercentage?.flipkart}%
                  </span>{" "}
                  From Last month
                </p>
              </div>
            </div>
          </div>
          <div className="shadow-shadow3 border border-gray2 rounded-lg p-4 md:p-5 lg:p-6">
            <div className="flex items-center gap-2 justify-between mb-2">
              <p className="text-gray text-sm font-medium">Ajio</p>
            </div>
            <div className="gap-4 flex items-center justify-between">
              <h3 className="text-darkBlack text-xl md:text-2xl lg:text-[30px] font-semibold">
                {deliveryData?.platformCounts?.ajio}
              </h3>
              <div className="bg-lightGreen rounded-[16px] flex items-center gap-1 py-[2px] px-2 h-6">
                <ArrowUp className="w-3 h-3 text-darkParrot" />
                <p className="text-darkGreen text-xs font-medium">
                  <span className="text-sm">
                    {deliveryData?.platformPercentage?.ajio}%
                  </span>{" "}
                  From Last month
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 border-b border-gray2 flex items-center gap-6">
          <div
            className={`pb-3 cursor-pointer text-sm font-medium border-b-[3px] ${
              status === "delivered"
                ? "border-purple text-purple"
                : "border-transparent text-black"
            }`}
            onClick={() => {
              setStatus("delivered");
              refetch();
            }}
          >
            Delivered
          </div>
          <div
            className={`pb-3 cursor-pointer text-sm font-medium border-b-[3px] ${
              status === "returned"
                ? "border-purple text-purple"
                : "border-transparent text-black"
            }`}
            onClick={() => {
              setStatus("returned");
              refetch();
            }}
          >
            Returned
          </div>
        </div>
        <div className="rounded-lg border border-gray2 shadow-shadow1 overflow-hidden">
          <div className="flex flex-col desktop:flex-row items-start desktop:items-center justify-between p-4 gap-2">
            <div className="flex border border-gray rounded-lg h-[40px] overflow-hidden">
              <div
                className={`px-2.5 md:px-4 flex items-center h-full justify-center text-sm md:text-base border-r border-gray cursor-pointer ${
                  platForm === "" ? "text-purple bg-gray5" : "text-black"
                }`}
                onClick={() => {
                  setPlatForm("");
                  refetch();
                }}
              >
                All
              </div>
              <div
                className={`px-2.5 md:px-4 flex items-center h-full justify-center text-sm md:text-base cursor-pointer ${
                  platForm === "myntra" ? "text-purple bg-gray5" : "text-black"
                }`}
                onClick={() => {
                  setPlatForm("myntra");
                  refetch();
                }}
              >
                Myntra
              </div>
              <div
                className={`px-2.5 md:px-4 flex items-center h-full justify-center text-sm md:text-base cursor-pointer border-l border-gray ${
                  platForm === "meesho" ? "text-purple bg-gray5" : "text-black"
                }`}
                onClick={() => {
                  setPlatForm("meesho");
                  refetch();
                }}
              >
                Meesho
              </div>
              <div
                className={`px-2.5 md:px-4 flex items-center h-full justify-center text-sm md:text-base cursor-pointer border-r border-l border-gray ${
                  platForm === "flipkart"
                    ? "text-purple bg-gray5"
                    : "text-black"
                }`}
                onClick={() => {
                  setPlatForm("flipkart");
                  refetch();
                }}
              >
                Flipkart
              </div>
              <div
                className={`px-2.5 md:px-4 flex items-center h-full justify-center text-sm md:text-base cursor-pointer ${
                  platForm === "ajio" ? "text-purple bg-gray5" : "text-black"
                }`}
                onClick={() => {
                  setPlatForm("ajio");
                  refetch();
                }}
              >
                Ajio
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 big:gap-4">
              {selectedRows &&
                ((selectedRows.delivered.length > 0 &&
                  status === "delivered") ||
                (selectedRows.returned.length > 0 && status === "returned") ? (
                  <div className="flex items-center gap-2 big:gap-4">
                    <div
                      className="border border-gray rounded-lg flex items-center gap-2 py-[10px] px-4 h-[40px] cursor-pointer"
                      onClick={() => {
                        const isSent = status === "delivered";
                        const rows = isSent
                          ? selectedRows.delivered
                          : selectedRows.returned;
                        const idsString = rows
                          .map((item: any) => item.id)
                          .join(",");
                        handleUpdateStatus(
                          idsString,
                          isSent ? "returned" : "delivered"
                        );
                      }}
                    >
                      <Check
                        className={`h-5 w-5 ${
                          status === "delivered"
                            ? "text-red"
                            : "text-darkParrot"
                        }`}
                      />
                      <span className="text-black text-sm whitespace-nowrap font-medium">
                        {status === "delivered"
                          ? "Mark as a Returned"
                          : "Mark as a Delivered"}
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
              ) : delivery?.length === 0 ? (
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
              Previous
            </button>
            <span className="text-black text-sm">
              Page <span className="font-semibold">{currentPage}</span> of{" "}
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
              Next
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <Modal onClose={handleConfirmPopup} isOpen={true}>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg relative flex flex-col items-center">
              <div
                onClick={() => setShowConfirm(false)}
                className="absolute top-3 right-3 cursor-pointer"
              >
                <X className="text-purple" />
              </div>
              <div className="w-[76px] h-[76px] bg-lightPurple rounded-full p-5 flex items-center justify-center mb-6">
                <ScanLine className="text-purple w-9 h-9" />
              </div>
              <h2 className="text-darkBlack text-lg md:text-xl desktop:text-2xl font-medium mb-3">
                Scan Product to Deliver
              </h2>
              <p className="text-gray text-sm desktop:text-base font-medium text-center">
                Scan QR code that available on <br /> product for mark as
                Delivered
              </p>
            </div>
            {/* <div className="bg-[#FFF1F1] rounded-lg p-3 md:p-5 fixed bottom-6 md:bottom-10 right-4 w-auto ml-4 max-w-[470px]">
              <h3 className="text-darkBlack text-sm md:text-base desktop:text-lg font-medium mb-2">
                Already Scanned Product
              </h3>
              <p className="text-gray font-medium text-xs md:text-sm desktop:text-base mb-[18px]">
                Scanned product is already mark as Delivered do you want to mark
                as Undelivered?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 md:h-[40px] md:items-center">
                <div className="w-full sm:w-1/2">
                  <Button
                    text={"No, Cancel"}
                    className={`border-2 border-purple shadow-shadow2 text-purple w-full`}
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <Button
                    text={"Yes, Mark as Undelivered"}
                    className={`bg-purple shadow-shadow2 text-white w-full`}
                  />
                </div>
              </div>
            </div> */}
          </div>
        </Modal>
      )}
    </>
  );
};
