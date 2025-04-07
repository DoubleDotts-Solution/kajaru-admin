import DateRangePicker from "../../../components/ui/daterangepicker";
import Button from "../../../components/common/button";
import { ArrowUp, Plus } from "lucide-react";
import { useGetConsignmentApiQuery } from "../../../store/slice/apiSlice/consignment";
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
import { useMemo, useState } from "react";
import Ic_search from "../../../assets/images/Ic_search.svg";
import Ic_filter from "../../../assets/images/Ic_filter.svg";
import { useNavigate } from "react-router-dom";
import Modal from "../../../components/common/modal";
import { formatDateToYYYYMMDD, formatTimestamp } from "../../../lib/utils";

export const Consignment = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
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
    // status:""
  };

  const { data, isLoading } = useGetConsignmentApiQuery(params);
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

  const navigate = useNavigate();
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
            <p className="text-black text-sm mb-[2px]">{row.original.status}</p>
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
    [navigate]
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

        <div className="mb-2 flex items-center justify-between bg-lightPurple rounded-[12px] py-3 px-4">
          <div className=""></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray1 shadow-shadow1 bg-[#fff] gap-2 rounded-lg py-[10px] px-[14px]">
              <img src={Ic_search} alt="search" />
              <input
                type="text"
                placeholder="Søk"
                className="focus-within:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 items-center">
              <div className="border border-gray1 rounded-[8px] flex gap-2 items-center py-[10px] px-4 cursor-pointer shadow-shadow1 h-[40px] bg-[#fff]">
                <img src={Ic_filter} alt="" />
                <span className="text-black font-medium text-sm">Filter</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray2 shadow-shadow2 overflow-hidden">
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
              className="px-[14px] py-2 rounded-lg disabled:opacity-50 shadow-shadow1 border border-gray1 text-black font-semibold text-sm"
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
              className="px-[14px] py-2 rounded-lg disabled:opacity-50 shadow-shadow1 border border-gray1 text-black font-semibold text-sm"
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
      </div>
    </>
  );
};
