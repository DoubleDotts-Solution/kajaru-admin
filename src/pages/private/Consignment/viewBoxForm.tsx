/* eslint-disable react-hooks/rules-of-hooks */
import Button from "../../../components/common/button";
import { useLocation } from "react-router-dom";
import { useGetBoxProductApiQuery } from "../../../store/slice/apiSlice/box";

export const ViewBoxForm = ({ closeDrawer }: { closeDrawer: any }) => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const id = searchParams.get("view-box-detail");
  const idNumber = Number(id);

  const { data } = useGetBoxProductApiQuery(idNumber, {
    skip: !id || isNaN(idNumber),
  });

  const boxData = (data as any)?.data;

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
                  </tr>
                </thead>
                <tbody>
                  {boxData?.product && boxData?.product.length > 0 ? (
                    boxData?.product.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="text-darkBlack text-xs md:text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                          <div className="truncate w-full">{item.sku_id}</div>
                        </td>
                        <td className="text-darkBlack text-xs md:text-sm font-medium py-2 px-4 border border-gray2 border-t-0">
                          <div className="truncate w-full">{item.qty_sent}</div>
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-end w-full gap-4 items-center sticky bottom-0 bg-white z-50 py-3 px-6">
          <div onClick={() => closeDrawer()} className="w-full">
            <Button
              text="Cancel"
              className="border-2 border-purple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2 w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};
