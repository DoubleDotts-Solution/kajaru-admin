/* eslint-disable react-hooks/rules-of-hooks */
import Button from "../../../components/common/button";
import toast from "react-hot-toast";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  ScanLine,
  Trash2,
  X,
} from "lucide-react";
import Modal from "../../../components/common/modal";
import {
  useAddProductApiMutation,
  useDeleteProductApiMutation,
  useEditProductApiMutation,
} from "../../../store/slice/apiSlice/product";
import { useGetBoxProductApiQuery } from "../../../store/slice/apiSlice/box";

const skuOptions = [
  "POLO-M-8015-BROWN",
  "TSRT-M-15-MORPINCH-MAKHI",
  "TSRT-03-XL-TEALMOREPINCH-D",
];

export const BoxForm = ({ closeDrawer }: { closeDrawer: any }) => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const id = searchParams.get("edit-box-detail");
  const idNumber = Number(id);

  const { data, refetch: refetchBoxProduct } = useGetBoxProductApiQuery(
    idNumber,
    {
      skip: !id || isNaN(idNumber),
    }
  );

  const boxData = (data as any)?.data;

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<any>(null);

  const handleConfirmPopup = () => {
    if (showConfirm) {
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };
  const [deleteProduct] = useDeleteProductApiMutation();

  const handleDelete = async (id: string) => {
    try {
      const response: any = await deleteProduct(id).unwrap();

      toast.success(response.message, { position: "top-right" });

      setShowConfirm(false);
      refetchBoxProduct();
    } catch (error: any) {
      toast.error(error.data.message, { position: "top-right" });
      setShowConfirm(false);
    }
  };

  const [products, setProducts] = useState<any>();
  const handleAddProduct = () => {
    setProducts({
      sku_id: "",
      qty_sent: "",
      box_id: idNumber,
    });
  };

  const [addProductApi] = useAddProductApiMutation();
  const [editProductApi] = useEditProductApiMutation();

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    setProducts((prev: any) => ({
      ...prev,
      sku_id: value,
    }));
    setIsOpen(false);
  };

  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<{
    sku_id: string;
    qty_sent: string;
  }>({
    sku_id: "",
    qty_sent: "",
  });

  const [errorPopup, setErrorPopup] = useState(false);
  const [error, setError] = useState(false);
  const [add, setAdd] = useState(false);

  const AddProduct = async () => {
    try {
      if (!errorPopup && !add) {
        const totalQtySent =
          boxData?.product &&
          boxData?.product.length > 0 &&
          boxData?.product.reduce(
            (sum: any, item: any) => sum + item.qty_sent,
            0
          );

        const a =
          totalQtySent + Number(editedData?.qty_sent || products?.qty_sent);

        if (a > boxData?.max_box_capacity) {
          setErrorPopup(true);
          return;
        }
      }
      if (editRowId) {
        const finalData = {
          sku_id: editedData?.sku_id,
          qty_sent: Number(editedData?.qty_sent),
          box_id: idNumber,
        };
        const response: any = await editProductApi({
          id: Number(editRowId),
          data: finalData,
        }).unwrap();
        toast.success(response.message, { position: "top-right" });
        // setEditedData(null);
        setEditRowId(null);
      } else {
        const response: any = await addProductApi(products).unwrap();
        toast.success(response.message, { position: "top-right" });
        setProducts(null);
      }
      refetchBoxProduct();
      setErrorPopup(false);
      setAdd(false);
    } catch (error: any) {
      toast.error(error.data.message, { position: "top-right" });
    }
  };

  const [scanOpen, setScanOpen] = useState(false);

  const handleScanConfirmPopup = () => {
    if (scanOpen) {
      setScanOpen(false);
    } else {
      setScanOpen(true);
    }
  };
  return (
    <>
      <div className="bg-gray5 p-4 lg:p-6 border-b border-gray2">
        <h5 className="text-darkBlack text-base md:text-xl desktop:text-2xl font-medium">
          Box ID: {idNumber}
        </h5>
      </div>

      <div>
        <div className="overflow-y-auto h-[calc(100vh-57px)] md:h-[calc(100vh-61px)] lg:h-[calc(100vh-77px)]">
          <div className="p-3 md:p-5 laptop:p-6 border-b border-gray2">
            <div
              className="border border-gray2 rounded-lg p-2 md:p-4 flex justify-between gap-2 md:gap-3"
              style={{
                boxShadow:
                  "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
              }}
            >
              <div className="flex flex-col gap-1 md:gap-2">
                <p className="text-gray font-medium text-xs md:text-sm">
                  Box Capacity
                </p>
                <h4 className="text-base md:text-xl text-darkBlack font-semibold">
                  {boxData?.max_box_capacity}
                </h4>
              </div>
              <div className="flex flex-col gap-1 md:gap-2">
                <p className="text-gray font-medium text-xs md:text-sm">
                  Product Packed
                </p>
                <h4 className="text-base md:text-xl text-darkBlack font-semibold">
                  {boxData?.product_packed}
                </h4>
              </div>
              <div className="flex flex-col gap-1 md:gap-2">
                <p className="text-gray font-medium text-xs md:text-sm">
                  Product Unpacked
                </p>
                <h4 className="text-base md:text-xl text-darkBlack font-semibold">
                  {typeof boxData?.max_box_capacity === "number" &&
                  typeof boxData?.product_packed === "number"
                    ? boxData.max_box_capacity - boxData.product_packed
                    : 0}
                </h4>
              </div>
            </div>
          </div>
          <div>
            <div className="border-b border-gray2 bg-gray5 py-2 md:py-4 px-4 md:px-6 flex items-center gap-2 justify-between">
              <h3 className="text-sm md:text-base desktop:text-lg text-darkBlack font-semibold">
                Product SKU
              </h3>
              <div
                className="flex items-center gap-2 text-purple cursor-pointer"
                onClick={handleAddProduct}
              >
                <Plus className="h-3 w-3 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm font-medium">
                  Add Product
                </span>
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto w-full">
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead className="bg-gray6">
                  <tr>
                    <th className="text-left text-gray text-xs md:text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                      SKU ID
                    </th>
                    <th className="text-left text-gray text-xs md:text-sm font-medium py-2 px-4 border border-l-2 border-r-2 border-gray2 border-t-0">
                      Qty Sent
                    </th>
                    <th className="text-left text-gray text-xs md:text-sm font-medium py-2 px-4 border border-gray2 border-t-0 w-max">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {boxData?.product && boxData?.product.length > 0 ? (
                    boxData?.product.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="text-darkBlack text-xs md:text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                          {editRowId === item.id ? (
                            <div className="w-full max-w-[180px]">
                              <div
                                className="bg-white border border-gray2 rounded px-3 py-2 text-xs md:text-sm cursor-pointer flex justify-between items-center gap-2"
                                onClick={() => setIsOpen(!isOpen)}
                              >
                                <span className="truncate text-xs md:text-sm w-[130px]">
                                  {editedData?.sku_id || "Select SKU"}
                                </span>
                                <div className="w-4 h-4">
                                  {isOpen ? (
                                    <ChevronUp
                                      className={`w-4 h-4 text-purple`}
                                    />
                                  ) : (
                                    <ChevronDown
                                      className={`w-4 h-4 text-purple`}
                                    />
                                  )}
                                </div>
                              </div>

                              {isOpen && (
                                <div className="absolute left-4 right-0 z-10 bg-white border border-gray2 rounded mt-1 max-h-48 overflow-y-auto shadow-md w-max">
                                  {skuOptions.map((sku) => (
                                    <div
                                      key={sku}
                                      onClick={() => {
                                        setEditedData({
                                          ...editedData,
                                          sku_id: sku,
                                        });
                                        setIsOpen(false);
                                      }}
                                      className={`px-3 py-2 text-xs md:text-sm cursor-pointer hover:bg-lightPurple ${
                                        sku === editedData?.sku_id
                                          ? "bg-lightPurple font-medium"
                                          : ""
                                      }`}
                                    >
                                      {sku}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="truncate w-[180px]">
                              {item.sku_id}
                            </div>
                          )}
                        </td>
                        <td className="text-darkBlack text-xs md:text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                          {editRowId === item.id ? (
                            <div className="flex items-center gap-3 truncate w-[160px]">
                              <input
                                type="number"
                                placeholder="Enter Qty"
                                className={`border rounded-[4px] ${
                                  error ? "border-red" : "border-gray2"
                                } py-2 px-3 text-xs md:text-sm font-medium focus-within:outline-none w-[100px]`}
                                value={editedData?.qty_sent}
                                onChange={(e) =>
                                  setEditedData({
                                    ...editedData,
                                    qty_sent: e.target.value,
                                  })
                                }
                              />
                              <span
                                className="text-purple text-xs md:text-sm font-medium cursor-pointer"
                                onClick={AddProduct}
                              >
                                Update
                              </span>
                            </div>
                          ) : (
                            <div className="truncate w-[160px]">
                              {item.qty_sent}
                            </div>
                          )}
                        </td>
                        <td className="text-darkBlack text-xs md:text-sm font-medium py-2 px-4 border border-gray2 border-t-0 w-max">
                          <div className="flex items-center gap-4 w-max">
                            <Trash2
                              className="h-3 md:h-5 w-3 md:w-5 text-darkRed cursor-pointer"
                              onClick={() => {
                                setShowConfirm(true);
                                setSelectedId(item.id);
                              }}
                            />
                            {editRowId === item.id ? (
                              <Pencil className="h-3 md:h-5 w-3 md:w-5 text-primary opacity-50" />
                            ) : (
                              <Pencil
                                className="h-3 md:h-5 w-3 md:w-5 text-primary cursor-pointer"
                                onClick={() => {
                                  setEditRowId(item.id);
                                  setEditedData({
                                    sku_id: item.sku_id,
                                    qty_sent: item.qty_sent,
                                  });
                                }}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center">
                      <td colSpan={3} className="p-3 border-b border-gray2">
                        No product found.
                      </td>
                    </tr>
                  )}
                  {products && (
                    <tr>
                      <td className="text-darkBlack text-xs md:text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                        <div className="w-full max-w-xs">
                          <div
                            className="bg-white border border-gray2 rounded px-3 py-2 text-xs md:text-sm cursor-pointer flex justify-between items-center gap-2"
                            onClick={() => setIsOpen(!isOpen)}
                          >
                            <span className="truncate text-xs md:text-sm w-[130px]">
                              {products.sku_id || "Select SKU"}
                            </span>
                            <div className="w-4 h-4">
                              {isOpen ? (
                                <ChevronUp className={`w-4 h-4 text-purple`} />
                              ) : (
                                <ChevronDown
                                  className={`w-4 h-4 text-purple`}
                                />
                              )}
                            </div>
                          </div>

                          {isOpen && (
                            <div className="absolute left-4 right-0 z-10 bg-white border border-gray2 rounded mt-1 max-h-48 overflow-y-auto shadow-md w-max">
                              {skuOptions.map((sku) => (
                                <div
                                  key={sku}
                                  onClick={() => handleSelect(sku)}
                                  className={`px-3 py-2 text-xs md:text-sm cursor-pointer hover:bg-lightPurple ${
                                    sku === products.sku_id
                                      ? "bg-lightPurple font-medium"
                                      : ""
                                  }`}
                                >
                                  {sku}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="text-darkBlack text-xs md:text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            placeholder="Enter Qty"
                            className="border rounded-[4px] border-gray2 py-2 px-3 text-xs md:text-sm font-medium focus-within:outline-none w-[100px]"
                            value={products.qty_sent}
                            onChange={(e) =>
                              setProducts((prev: any) => ({
                                ...prev,
                                qty_sent: Number(e.target.value),
                              }))
                            }
                          />
                          <span
                            className="text-purple text-xs md:text-sm font-medium cursor-pointer"
                            onClick={AddProduct}
                          >
                            Add
                          </span>
                        </div>
                      </td>
                      <td className="text-darkBlack text-xs md:text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                        <div className="flex items-center gap-4">
                          <Trash2
                            className="h-3 md:h-5 w-3 md:w-5 text-darkRed cursor-pointer"
                            onClick={() => setProducts(null)}
                          />
                          <Pencil className="h-3 md:h-5 w-3 md:w-5 text-primary cursor-pointer opacity-50" />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-end w-full gap-4 items-center sticky bottom-0 bg-white z-50 py-3 px-6">
          <div onClick={() => closeDrawer()} className="w-1/2">
            <Button
              text="Cancel"
              className="border-2 border-purple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2 w-full"
            />
          </div>
          <div className="w-1/2">
            <Button
              text="Scan FSN"
              className="border-2 border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2 w-full"
              type="button"
              onClick={() => setScanOpen(true)}
            />
          </div>
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
      {errorPopup && (
        <div
          className="bg-[#FFF1F1] rounded-lg sm:w-full m-4 sm:max-w-[393px] right-0 bottom-11 absolute p-3 md:p-5"
          style={{
            zIndex: 999,
          }}
        >
          <h4 className="text-darkBlack text-sm md:text-base desktop:text-lg font-medium mb-1 md:mb-2">
            Exceeding Box Limit
          </h4>
          <p className="text-gray text-sm md:text-base desktop:text-lg font-medium mb-2 md:mb-4">
            Do you want to add more product then box capacity?
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 md:h-[40px] md:items-center">
            <div className="w-full sm:w-1/2">
              <Button
                text={"No, Cancel"}
                className={`border-2 border-purple shadow-shadow2 text-purple w-full`}
                onClick={() => {
                  setError(true);
                  setErrorPopup(false);
                }}
              />
            </div>
            <div className="w-full sm:w-1/2">
              <Button
                text={"Yes, Continue"}
                className={`bg-purple shadow-shadow2 text-white w-full`}
                onClick={() => {
                  setErrorPopup(false);
                  AddProduct();
                  setAdd(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {scanOpen && (
        <Modal onClose={handleScanConfirmPopup} isOpen={true}>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg relative flex flex-col items-center">
              <div
                onClick={() => setScanOpen(false)}
                className="absolute top-3 right-3 cursor-pointer"
              >
                <X className="w-6 h-6 text-purple" />
              </div>
              <div className="w-[76px] h-[76px] bg-lightPurple rounded-full p-5 flex items-center justify-center mb-6">
                <ScanLine className="text-purple w-9 h-9" />
              </div>
              <h2 className="text-darkBlack text-lg md:text-xl desktop:text-2xl font-medium mb-3">
                Scan QR on Box
              </h2>
              <p className="text-gray text-sm desktop:text-base font-medium text-center">
                Scan SKU ID QR for adding Product
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
