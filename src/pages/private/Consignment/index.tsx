import DateRangePicker from "../../../components/ui/daterangepicker";
import Button from "../../../components/common/button";
import { ArrowUp, Check, Plus } from "lucide-react";
import {
  useGetConsignmentApiQuery,
  useUpdateConsignmentStatusApiMutation,
} from "../../../store/slice/apiSlice/consignment";
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
import Ic_filter from "../../../assets/images/Ic_filter.svg";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../../../components/common/modal";
import { formatDateToYYYYMMDD, formatTimestamp } from "../../../lib/utils";
import toast from "react-hot-toast";
import Drawer from "../../../components/ui/drawer";
import { ConsignmentForm } from "./consignmentForm";

export const Consignment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("unsent");
  const [selectedRows, setSelectedRows] = useState<any>({
    sent: [],
    unsent: [],
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

  const { data, isLoading, refetch } = useGetConsignmentApiQuery(params);
  const consignmentData = (data as any) || {
    data: [],
    pagination: {
      totalPages: 1,
      currentPage: 1,
      limit: 0,
      sentCount: 0,
      totalCount: 0,
      unsentCount: 0,
    },
  };

  const consignment = consignmentData?.data;

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<any>(null);

  const handleDelete = async (id: string) => {
    console.log(id);
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
        accessorKey: "Consignment No.",
        header: "Consignment No.",
        cell: ({ row }: any) => {
          return (
            <>
              <div className="text-purple text-sm font-semibold">
                {row.original.consignment_number}
              </div>
            </>
          );
        },
      },
      {
        accessorKey: "Created On",
        header: "Created On",
        cell: ({ row }: any) => (
          <p className="font-semibold text-sm text-darkBlack">
            {formatTimestamp(row.original.updatedAt)}
          </p>
        ),
      },
      {
        accessorKey: "No. of Box",
        header: "No. of Box",
        cell: ({ row }: any) => (
          <p className="text-sm text-darkBlack">{row.original.number_of_box}</p>
        ),
      },
      {
        accessorKey: "Tags",
        header: "Tags",
        cell: ({ row }: any) => (
          <p className="text-sm text-darkBlack">{row.original.tags}</p>
          // <p className="text-sm text-darkBlack">6</p>
        ),
      },
      {
        accessorKey: "Consignment Exls",
        header: "Consignment Exls",
        cell: ({ row }: any) => (
          <p className="text-sm font-semibold text-black">
            {/* {row.original.updatedAt} */}
            abc
          </p>
        ),
      },
      {
        accessorKey: "Status",
        header: "Status",
        cell: ({ row }: any) => (
          <div>
            {row.original.status === "sent" ? (
              <p className="text-sm bg-lightRed text-darkRed py-[2px] px-[10px] font-medium rounded-[16px] w-max">
                Sent
              </p>
            ) : (
              <p className="text-sm bg-lightGreen text-darkGreen py-[2px] px-[10px] font-medium rounded-[16px] w-max">
                Unsent
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
                onClick={() =>
                  navigate(`/edit-til-leverandor/${row.original.id}`)
                }
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
  const pagination = consignmentData?.pagination;

  const table = useReactTable({
    data: consignment,
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
    pageCount: Math.ceil(consignment?.length / pagination?.limit),
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

  const [updateStatus] = useUpdateConsignmentStatusApiMutation();
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
      toast.success(error.message, { position: "top-right" });
    }
  };
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("add-consignment")) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  }, [location.search]);

  const openDrawer = () => {
    setDrawerOpen(true);
    navigate("?add-consignment");
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    navigate("/consignment");
  };
  return (
    <>
      <div className="py-8 px-6">
        <div className="flex items-center justify-between gap-3 mb-8">
          <h2 className="text-darkBlack text-[32px] font-medium">
            Consignment
          </h2>
          <div className="flex gap-4 h-[40px] items-center">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
            />
            <Button
              text={"Create Consignment"}
              className={`bg-purple shadow-shadow2 text-white`}
              icon={<Plus className="text-white w-5 h-5" />}
              onClick={openDrawer}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="shadow-shadow3 border border-gray2 rounded-lg p-6">
            <div className="flex items-center gap-2 justify-between mb-2">
              <p className="text-gray text-sm font-medium">Total Consignment</p>
            </div>
            <div className="gap-4 flex items-center justify-between">
              <h3 className="text-darkBlack text-[30px] font-semibold">
                {pagination?.totalCount}
              </h3>
              <div className="bg-lightGreen rounded-[16px] flex items-center gap-1 py-[2px] px-2 h-6">
                <ArrowUp className="w-3 h-3 text-darkParrot" />
                <p className="text-darkGreen text-xs font-medium">
                  <span className="text-sm">10%</span> From Last month
                </p>
              </div>
            </div>
          </div>
          <div className="shadow-shadow3 border border-gray2 rounded-lg p-6">
            <div className="flex items-center gap-2 justify-between mb-2">
              <p className="text-gray text-sm font-medium">Consignment Sent</p>
            </div>
            <div className="gap-4 flex items-center justify-between">
              <h3 className="text-darkBlack text-[30px] font-semibold">
                {pagination?.sentCount}
              </h3>
              <div className="bg-lightGreen rounded-[16px] flex items-center gap-1 py-[2px] px-2 h-6">
                <ArrowUp className="w-3 h-3 text-darkParrot" />
                <p className="text-darkGreen text-xs font-medium">
                  <span className="text-sm">10%</span> From Last month
                </p>
              </div>
            </div>
          </div>
          <div className="shadow-shadow3 border border-gray2 rounded-lg p-6">
            <div className="flex items-center gap-2 justify-between mb-2">
              <p className="text-gray text-sm font-medium">
                Consignment not sent
              </p>
            </div>
            <div className="gap-4 flex items-center justify-between">
              <h3 className="text-darkBlack text-[30px] font-semibold">
                {pagination?.unsentCount}
              </h3>
              <div className="bg-lightGreen rounded-[16px] flex items-center gap-1 py-[2px] px-2 h-6">
                <ArrowUp className="w-3 h-3 text-darkParrot" />
                <p className="text-darkGreen text-xs font-medium">
                  <span className="text-sm">10%</span> From Last month
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray2 shadow-shadow1 overflow-hidden">
          <div className="flex items-center justify-between p-4">
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
            <div className="flex items-center gap-4">
              {selectedRows &&
                ((selectedRows.sent.length > 0 && status === "sent") ||
                (selectedRows.unsent.length > 0 && status === "unsent") ? (
                  <div className="flex items-center gap-4">
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
                      <span className="text-black text-sm font-medium">
                        {status === "sent"
                          ? "Mark as a Unsent"
                          : "Mark as a Sent"}
                      </span>
                    </div>
                    <div className="border-l border-gray2 h-[20px]"></div>
                  </div>
                ) : null)}

              <div className="flex items-center border border-gray shadow-shadow2 bg-[#fff] gap-2 rounded-lg py-[10px] px-[14px] h-[40px]">
                <img src={Ic_search} alt="search" />
                <input
                  type="text"
                  placeholder="Search"
                  className="focus-within:outline-none"
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
              ) : consignment?.length === 0 ? (
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
                      <TableCell key={cell.id} className="px-6 py-3">
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
          <div className="flex justify-between items-center py-4 px-6 border-t border-gray2">
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
                  Er du sikker på at du vil slette?
                </p>
                <div className="flex justify-center mt-5 w-full gap-5 items-center">
                  <div
                    onClick={() => setShowConfirm(false)}
                    className="w-1/2 sm:w-auto"
                  >
                    <Button
                      text="Avbryt"
                      className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                    />
                  </div>
                  <div onClick={() => handleDelete(selectedId)}>
                    <Button
                      text="Bekrefte"
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
            <ConsignmentForm refetch={refetch} />
          </Drawer>
        )}
      </div>
    </>
  );
};
