/* eslint-disable react-hooks/rules-of-hooks */
import Button from "../../../components/common/button";
import toast from "react-hot-toast";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import Modal from "../../../components/common/modal";
import {
  useAddProductApiMutation,
  useDeleteProductApiMutation,
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
  const { data, refetch: refetchBoxProduct } = useGetBoxProductApiQuery(
    Number(id)
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
      box_id: id,
    });
  };

  const [addProductApi] = useAddProductApiMutation();

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    setProducts((prev: any) => ({
      ...prev,
      sku_id: value,
    }));
    setIsOpen(false);
  };
  const AddProduct = async () => {
    try {
      // if (id) {
      //   const response: any = await updateConsignment({
      //     id: Number(id),
      //     data: formData,
      //   }).unwrap();
      //   toast.success(response.message, { position: "top-right" });
      // } else {
      const response: any = await addProductApi(products).unwrap();
      toast.success(response.message, { position: "top-right" });
      // }
      refetchBoxProduct();
      setProducts(null);
    } catch (error: any) {
      toast.error(error.data.message, { position: "top-right" });
    }
  };
  return (
    <>
      <div className="bg-gray5 p-4 lg:p-6 border-b border-gray2">
        <h5 className="text-darkBlack text-base md:text-xl desktop:text-2xl font-medium">
          Box ID: {id}
        </h5>
      </div>

      <div>
        <div className="overflow-y-auto h-[calc(100vh-57px)] md:h-[calc(100vh-61px)] lg:h-[calc(100vh-77px)]">
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
                <p className="text-gray font-medium text-sm">Product Packed</p>
                <h4 className="text-xl text-darkBlack font-semibold">
                  {boxData?.product_packed}
                </h4>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-gray font-medium text-sm">
                  Product Unpacked
                </p>
                <h4 className="text-xl text-darkBlack font-semibold">
                  {typeof boxData?.max_box_capacity === "number" &&
                  typeof boxData?.product_packed === "number"
                    ? boxData.max_box_capacity - boxData.product_packed
                    : 0}
                </h4>
              </div>
            </div>
          </div>
          <div>
            <div className="border-b border-gray2 bg-gray5 py-4 px-6 flex items-center gap-2 justify-between">
              <h3 className="text-lg text-darkBlack font-semibold">
                Product SKU
              </h3>
              <div
                className="flex items-center gap-2 text-purple cursor-pointer"
                onClick={handleAddProduct}
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">Add Product</span>
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto w-full">
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead className="bg-gray6">
                  <tr>
                    <th className="text-left text-gray text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                      SKU ID
                    </th>
                    <th className="text-left text-gray text-sm font-medium py-2 px-4 border border-l-2 border-r-2 border-gray2 border-t-0">
                      Qty Sent
                    </th>
                    <th className="text-left text-gray text-sm font-medium py-2 px-4 border border-gray2 border-t-0 w-max">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {boxData?.product && boxData?.product.length > 0 ? (
                    boxData?.product.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="text-darkBlack text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                          {item.sku_id}
                        </td>
                        <td className="text-darkBlack text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                          {item.qty_sent}
                        </td>
                        <td className="text-darkBlack text-sm font-medium py-2 px-4 border border-gray2 border-t-0 w-max">
                          <div className="flex items-center gap-4 w-max">
                            <Trash2
                              className="h-5 w-5 text-darkRed cursor-pointer"
                              onClick={() => {
                                setShowConfirm(true);
                                setSelectedId(item.id);
                              }}
                            />
                            <Pencil
                              className="h-5 w-5 text-primary cursor-pointer"
                              // onClick={() => {
                              //   navigate(`?edit-box-detail=${row.original.id}`);
                              //   setDrawerOpen(true);
                              // }}
                            />
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
                      <td className="text-darkBlack text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                        <div className="w-full max-w-xs">
                          <div
                            className="bg-white border border-gray2 rounded px-3 py-2 text-sm cursor-pointer flex justify-between items-center gap-2"
                            onClick={() => setIsOpen(!isOpen)}
                          >
                            <span className="truncate text-sm w-[100px]">
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
                                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-lightPurple ${
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
                      <td className="text-darkBlack text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            placeholder="Enter Qty"
                            className="border rounded-[4px] border-gray2 py-2 px-3 text-sm font-medium focus-within:outline-none w-[100px]"
                            value={products.qty_sent}
                            onChange={(e) =>
                              setProducts((prev: any) => ({
                                ...prev,
                                qty_sent: Number(e.target.value),
                              }))
                            }
                          />
                          <span
                            className="text-purple text-sm font-medium cursor-pointer"
                            onClick={AddProduct}
                          >
                            Add
                          </span>
                        </div>
                      </td>
                      <td className="text-darkBlack text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                        <div className="flex items-center gap-4">
                          <Trash2
                            className="h-5 w-5 text-darkRed cursor-pointer"
                            onClick={() => setProducts(null)}
                          />
                          <Pencil className="h-5 w-5 text-primary cursor-pointer opacity-50" />
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
    </>
  );
};
